package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AdminOrderDetailResponse {

    private UUID id;
    private UUID userId;
    private List<OrderItemDto> items;
    private BigDecimal totalAmount;
    private String status;
    private ShippingDto shipping;
    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @Builder
    public static class OrderItemDto {
        private UUID productId;
        private Integer quantity;
        private BigDecimal price;
    }

    @Data
    @Builder
    public static class ShippingDto {
        private String recipient;
        private String phone;
        private String address;
        private String zipCode;
    }
}
