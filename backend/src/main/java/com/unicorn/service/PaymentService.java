package com.unicorn.service;

import com.unicorn.client.PayPalClient;
import com.unicorn.client.TossPaymentsClient;
import com.unicorn.dto.payment.ConfirmPaymentRequest;
import com.unicorn.dto.payment.ConfirmPaymentResponse;
import com.unicorn.dto.payment.PayPalCreateOrderRequest;
import com.unicorn.dto.payment.PayPalCreateOrderResponse;
import com.unicorn.entity.Order;
import com.unicorn.entity.OrderItem;
import com.unicorn.repository.CartItemRepository;
import com.unicorn.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final TossPaymentsClient tossPaymentsClient;
    private final PayPalClient payPalClient;
    private final ExchangeRateService exchangeRateService;
    private final CartItemRepository cartItemRepository;

    @Transactional(readOnly = true)
    public PayPalCreateOrderResponse createPayPalOrder(Long userId, PayPalCreateOrderRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        if (!order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        if (!"pending".equals(order.getStatus())) {
            throw new IllegalArgumentException("결제 대기 중인 주문이 아닙니다.");
        }

        BigDecimal usd = exchangeRateService.krwToUsd(order.getTotalAmount());
        if (usd.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("달러 환산 금액이 잘못되었습니다.");
        }

        String amountUsdStr = usd.setScale(2, RoundingMode.HALF_UP).toPlainString();
        String referenceId = "order-" + order.getId();
        String paypalOrderId = payPalClient.createOrder(amountUsdStr, referenceId);
        
        return PayPalCreateOrderResponse.builder()
                .paypalOrderId(paypalOrderId)
                .amountUsd(usd)
                .build();
    }

    /**
     * 결제 승인 + 장바구니 항목 삭제
     */
    @Transactional
    public ConfirmPaymentResponse confirmPayment(Long userId, ConfirmPaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (!order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }

        String provider = request.getPaymentProvider() != null ? request.getPaymentProvider().trim().toLowerCase() : "";
        if (request.getPaymentKey() == null || request.getPaymentKey().isBlank()) {
            throw new IllegalArgumentException("paymentKey가 필요합니다.");
        }

        if ("toss".equals(provider)) {
            String paymentOrderId = "order-" + order.getId();
            tossPaymentsClient.confirm(
                    request.getPaymentKey(),
                    paymentOrderId,
                    request.getAmount());
        } else if ("paypal".equals(provider)) {
            payPalClient.captureOrder(request.getPaymentKey());
        }

        order.setStatus("paid");
        order.setPaidAt(Instant.now());
        order.setPaymentId(request.getPaymentKey());
        orderRepository.save(order);

        // 주문에 포함된 상품들을 장바구니에서 찾아 삭제
        for (OrderItem oi : order.getItems()) {
            String color = oi.getColor() != null ? oi.getColor() : "";
            cartItemRepository.findByUserIdAndProductIdAndColor(userId, oi.getProduct().getId(), color)
                    .ifPresent(cartItemRepository::delete);
        }

        return ConfirmPaymentResponse.builder()
                .orderId(order.getId())
                .status("paid")
                .paidAt(order.getPaidAt())
                .build();
    }
}
