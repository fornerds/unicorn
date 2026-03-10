package com.unicorn.service;

import com.unicorn.dto.order.CreateOrderRequest;
import com.unicorn.dto.order.CreateOrderResponse;
import com.unicorn.dto.order.OrderDetailResponse;
import com.unicorn.dto.order.OrderListResponse;
import com.unicorn.entity.Order;
import com.unicorn.entity.OrderItem;
import com.unicorn.entity.Product;
import com.unicorn.entity.User;
import com.unicorn.repository.CartItemRepository;
import com.unicorn.repository.OrderRepository;
import com.unicorn.repository.ProductColorStockRepository;
import com.unicorn.repository.ProductRepository;
import com.unicorn.repository.UserRepository;
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
    private final ProductRepository productRepository;
    private final ProductColorStockRepository productColorStockRepository;
    private final ExchangeRateService exchangeRateService;

    @Value("${app.payment.redirect-url-base:https://pg.example.com/redirect}")
    private String paymentRedirectUrlBase;

    @Transactional
    public CreateOrderResponse createOrder(Long userId, CreateOrderRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("주문할 항목이 없습니다.");
        }

        String paymentMethod = request.getPaymentMethod() != null ? request.getPaymentMethod().trim().toLowerCase() : "";
        boolean payInUsd = "paypal".equals(paymentMethod);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product p = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다. ID: " + itemReq.getProductId()));
            String color = itemReq.getColor() != null && !itemReq.getColor().isBlank() ? itemReq.getColor().trim() : "";
            int qty = itemReq.getQuantity();
            if (p.getStock() < qty) {
                throw new IllegalArgumentException("제품 " + p.getName() + " 재고가 부족합니다.");
            }
            int availableColorStock = getAvailableStock(p.getId(), color, p.getStock());
            if (availableColorStock < qty) {
                throw new IllegalArgumentException("제품 " + p.getName() + (color.isEmpty() ? "" : " (" + color + ")") + " 재고가 부족합니다.");
            }
            BigDecimal itemPrice = payInUsd
                    ? exchangeRateService.priceToUsd(p.getPrice(), p.getCurrency())
                    : exchangeRateService.priceToKrw(p.getPrice(), p.getCurrency());
            BigDecimal lineTotal = itemPrice.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            OrderItem oi = OrderItem.builder()
                    .product(p)
                    .color(itemReq.getColor())
                    .quantity(itemReq.getQuantity())
                    .price(itemPrice)
                    .build();
            orderItems.add(oi);
        }

        String orderCurrency = payInUsd ? "USD" : "KRW";
        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .currency(orderCurrency)
                .status("pending")
                .recipient(request.getShippingAddress().getRecipient())
                .phone(request.getShippingAddress().getPhone())
                .address(request.getShippingAddress().getAddress())
                .zipCode(request.getShippingAddress().getZipCode())
                .deliveryRequest(request.getShippingAddress().getDeliveryRequest())
                .paymentProvider(request.getPaymentMethod())
                .build();
        
        order = orderRepository.save(order);
        for (OrderItem oi : orderItems) {
            oi.setOrder(order);
        }
        order.getItems().addAll(orderItems);
        orderRepository.save(order);

        String paymentOrderId = "order-" + order.getId();
        return CreateOrderResponse.builder()
                .orderId(order.getId())
                .totalAmount(totalAmount)
                .paymentOrderId(paymentOrderId)
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
        List<OrderDetailResponse.OrderItemDto> items = order.getItems().stream()
                .map(oi -> toOrderItemDto(oi, order))
                .collect(Collectors.toList());
        String currency = order.getCurrency() != null ? order.getCurrency() : "KRW";
        return OrderDetailResponse.builder()
                .id(order.getId())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .currency(currency)
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
        List<OrderDetailResponse.OrderItemDto> items = order.getItems().stream()
                .map(oi -> toOrderItemDto(oi, order))
                .collect(Collectors.toList());
        String currency = order.getCurrency() != null ? order.getCurrency() : "KRW";
        return OrderListResponse.builder()
                .id(order.getId())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .currency(currency)
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderDetailResponse.OrderItemDto toOrderItemDto(OrderItem oi, Order order) {
        String color = oi.getColor() != null && !oi.getColor().isEmpty() ? oi.getColor() : null;
        String colorCode = null;
        if (color != null) {
            colorCode = productColorStockRepository.findByProduct_IdAndColor(oi.getProduct().getId(), color)
                    .map(cs -> cs.getColorCode())
                    .orElse(null);
        }
        return OrderDetailResponse.OrderItemDto.builder()
                .productId(oi.getProduct().getId())
                .color(color)
                .colorCode(colorCode)
                .product(OrderDetailResponse.ProductSummary.builder()
                        .id(oi.getProduct().getId())
                        .name(oi.getProduct().getName())
                        .imageUrl(oi.getProduct().getImageUrl())
                        .build())
                .quantity(oi.getQuantity())
                .price(oi.getPrice())
                .build();
    }

    private int getAvailableStock(Long productId, String color, int productStock) {
        if (color != null && !color.isEmpty()) {
            return productColorStockRepository.findByProductIdOrderByColor(productId).stream()
                    .filter(cs -> color.equals(cs.getColor()))
                    .findFirst()
                    .map(com.unicorn.entity.ProductColorStock::getStock)
                    .orElse(0);
        }
        return productStock;
    }
}
