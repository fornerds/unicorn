package com.unicorn.service;

import com.unicorn.client.PayPalClient;
import com.unicorn.client.TossPaymentsClient;
import com.unicorn.dto.order.CreateOrderRequest;
import com.unicorn.dto.order.CreateOrderResponse;
import com.unicorn.dto.payment.ConfirmAndCreateOrderRequest;
import com.unicorn.dto.payment.ConfirmPaymentResponse;
import com.unicorn.dto.payment.PayPalCreateOrderRequest;
import com.unicorn.dto.payment.PayPalCreateOrderResponse;
import com.unicorn.entity.Order;
import com.unicorn.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;
    private final OrderService orderService;
    private final TossPaymentsClient tossPaymentsClient;
    private final PayPalClient payPalClient;
    private final ExchangeRateService exchangeRateService;

    @Transactional(readOnly = true)
    public PayPalCreateOrderResponse createPayPalOrder(Long userId, PayPalCreateOrderRequest request) {
        BigDecimal usd;
        if (request.getAmountKrw() != null && request.getAmountKrw().compareTo(BigDecimal.ZERO) > 0) {
            usd = exchangeRateService.krwToUsd(request.getAmountKrw());
            if (usd.compareTo(BigDecimal.ZERO) < 0) usd = BigDecimal.ZERO;
        } else if (request.getAmountUsd() != null && request.getAmountUsd().compareTo(BigDecimal.ZERO) > 0) {
            usd = request.getAmountUsd();
        } else {
            throw new IllegalArgumentException("결제 금액(USD 또는 KRW)이 필요합니다.");
        }
        String amountUsdStr = usd.setScale(2, RoundingMode.HALF_UP).toPlainString();
        String referenceId = "temp-" + java.util.UUID.randomUUID().toString().replace("-", "");
        String paypalOrderId = payPalClient.createOrder(amountUsdStr, referenceId);
        return PayPalCreateOrderResponse.builder()
                .paypalOrderId(paypalOrderId)
                .amountUsd(usd)
                .build();
    }

    /**
     * 결제 성공 시 주문 생성 + PG 승인 + 장바구니 삭제. (prepare 흐름: 주문은 결제 후에만 생성)
     */
    @Transactional
    public ConfirmPaymentResponse confirmAndCreateOrder(Long userId, ConfirmAndCreateOrderRequest request) {
        CreateOrderRequest orderRequest = new CreateOrderRequest();
        orderRequest.setShippingAddress(request.getShippingAddress());
        orderRequest.setPaymentMethod(request.getPaymentMethod());
        orderRequest.setCartItemIds(request.getCartItemIds());

        CreateOrderResponse created = orderService.createFromCart(userId, orderRequest);
        Order order = orderRepository.findById(created.getOrderId())
                .orElseThrow(() -> new IllegalStateException("주문 생성 후 조회 실패"));

        String provider = request.getPaymentProvider() != null ? request.getPaymentProvider().trim().toLowerCase() : "";
        if (request.getPaymentKey() == null || request.getPaymentKey().isBlank()) {
            throw new IllegalArgumentException("paymentKey가 필요합니다.");
        }

        if ("toss".equals(provider)) {
            if (request.getTempOrderId() == null || request.getTempOrderId().isBlank()) {
                throw new IllegalArgumentException("토스 결제 시 tempOrderId가 필요합니다.");
            }
            tossPaymentsClient.confirm(
                    request.getPaymentKey(),
                    request.getTempOrderId(),
                    request.getAmount());
        } else if ("paypal".equals(provider)) {
            payPalClient.captureOrder(request.getPaymentKey());
        }

        order.setStatus("paid");
        order.setPaidAt(Instant.now());
        order.setPaymentId(request.getPaymentKey());
        orderRepository.save(order);
        return ConfirmPaymentResponse.builder()
                .orderId(order.getId())
                .status("paid")
                .paidAt(order.getPaidAt())
                .build();
    }
}
