package com.unicorn.service;

import com.unicorn.dto.order.CreateOrderRequest;
import com.unicorn.dto.order.CreateOrderResponse;
import com.unicorn.dto.order.OrderDetailResponse;
import com.unicorn.dto.order.OrderListResponse;
import com.unicorn.entity.*;
import com.unicorn.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;

    @Value("${app.payment.redirect-url-base:https://pg.example.com/redirect}")
    private String paymentRedirectUrlBase;

    @Transactional
    public CreateOrderResponse createFromCart(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        List<CartItem> cartItems = request.getCartItemIds() == null || request.getCartItemIds().isEmpty()
                ? cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId)
                : cartItemRepository.findAllById(request.getCartItemIds()).stream()
                .filter(ci -> ci.getUser().getId().equals(userId))
                .collect(Collectors.toList());
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("장바구니가 비어 있습니다.");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem ci : cartItems) {
            Product p = ci.getProduct();
            if (p.getStock() < ci.getQuantity()) {
                throw new IllegalArgumentException("제품 " + p.getName() + " 재고가 부족합니다.");
            }
            BigDecimal lineTotal = p.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);
            OrderItem oi = OrderItem.builder()
                    .product(p)
                    .quantity(ci.getQuantity())
                    .price(p.getPrice())
                    .build();
            orderItems.add(oi);
        }

        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status("pending")
                .recipient(request.getShippingAddress().getRecipient())
                .phone(request.getShippingAddress().getPhone())
                .address(request.getShippingAddress().getAddress())
                .zipCode(request.getShippingAddress().getZipCode())
                .paymentProvider(request.getPaymentMethod())
                .build();
        order = orderRepository.save(order);
        for (OrderItem oi : orderItems) {
            oi.setOrder(order);
        }
        order.getItems().addAll(orderItems);
        orderRepository.save(order);

        for (CartItem ci : cartItems) {
            cartItemRepository.delete(ci);
        }

        return CreateOrderResponse.builder()
                .orderId(order.getId())
                .totalAmount(totalAmount)
                .paymentRedirectUrl(paymentRedirectUrlBase + "?orderId=" + order.getId())
                .paymentId("pg-txn-" + order.getId())
                .build();
    }

    @Transactional(readOnly = true)
    public OrderDetailResponse getOrder(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        if (!order.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("권한이 없습니다.");
        }
        return toDetailResponse(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderListResponse> getMyOrders(Long userId, String status, int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)));
        Page<Order> orders = status != null && !status.isBlank()
                ? orderRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, status, pageable)
                : orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return orders.map(this::toListResponse);
    }

    private OrderDetailResponse toDetailResponse(Order order) {
        List<OrderDetailResponse.OrderItemDto> items = order.getItems().stream().map(oi -> OrderDetailResponse.OrderItemDto.builder()
                .productId(oi.getProduct().getId())
                .product(OrderDetailResponse.ProductSummary.builder()
                        .id(oi.getProduct().getId())
                        .name(oi.getProduct().getName())
                        .imageUrl(oi.getProduct().getImageUrl())
                        .build())
                .quantity(oi.getQuantity())
                .price(oi.getPrice())
                .build()).collect(Collectors.toList());
        return OrderDetailResponse.builder()
                .id(order.getId())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shipping(OrderDetailResponse.ShippingDto.builder()
                        .recipient(order.getRecipient())
                        .phone(order.getPhone())
                        .address(order.getAddress())
                        .zipCode(order.getZipCode())
                        .build())
                .payment(order.getPaidAt() != null ? OrderDetailResponse.PaymentDto.builder()
                        .provider(order.getPaymentProvider())
                        .paidAt(order.getPaidAt())
                        .build() : null)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderListResponse toListResponse(Order order) {
        List<OrderDetailResponse.OrderItemDto> items = order.getItems().stream().map(oi -> OrderDetailResponse.OrderItemDto.builder()
                .productId(oi.getProduct().getId())
                .product(OrderDetailResponse.ProductSummary.builder()
                        .id(oi.getProduct().getId())
                        .name(oi.getProduct().getName())
                        .imageUrl(oi.getProduct().getImageUrl())
                        .build())
                .quantity(oi.getQuantity())
                .price(oi.getPrice())
                .build()).collect(Collectors.toList());
        return OrderListResponse.builder()
                .id(order.getId())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
