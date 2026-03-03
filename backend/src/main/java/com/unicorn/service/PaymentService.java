package com.unicorn.service;

import com.unicorn.dto.payment.ConfirmPaymentRequest;
import com.unicorn.dto.payment.ConfirmPaymentResponse;
import com.unicorn.entity.Order;
import com.unicorn.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final OrderRepository orderRepository;

    @Transactional
    public ConfirmPaymentResponse confirm(ConfirmPaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        order.setStatus("paid");
        order.setPaidAt(Instant.now());
        order.setPaymentId(request.getTransactionId() != null ? request.getTransactionId() : request.getPaymentKey());
        orderRepository.save(order);
        return ConfirmPaymentResponse.builder()
                .orderId(order.getId())
                .status("paid")
                .paidAt(order.getPaidAt())
                .build();
    }
}
