package com.unicorn.dto.cart;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class CartResponse {

    private List<CartItemDto> items;
    private BigDecimal totalAmount;

    @Data
    @Builder
    public static class CartItemDto {
        private UUID id;
        private UUID productId;
        private ProductSummary product;
        private Integer quantity;
        private BigDecimal price;
    }

    @Data
    @Builder
    public static class ProductSummary {
        private UUID id;
        private String name;
        private BigDecimal price;
        private String imageUrl;
    }
}
