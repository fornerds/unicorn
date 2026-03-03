package com.unicorn.dto.order;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class OrderDetailResponse {

    private Long id;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private String status;
    private ShippingDto shipping;
    private PaymentDto payment;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    public static class OrderItemDto {
        private Long productId;
        private ProductSummary product;
        private Integer quantity;
        private BigDecimal price;
    }

    @Data
    @Builder
    public static class ProductSummary {
        private Long id;
        private String name;
        private String imageUrl;
    }

    @Data
    @Builder
    public static class ShippingDto {
        private String recipient;
        private String phone;
        private String address;
        private String zipCode;
    }

    @Data
    @Builder
    public static class PaymentDto {
        private String provider;
        private Instant paidAt;
    }
}
