package com.unicorn.dto.cart;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {

    private List<CartItemDto> items;
    private BigDecimal totalAmount;

    @Data
    @Builder
    public static class CartItemDto {
        private Long id;
        private Long productId;
        private String color;
        private ProductSummary product;
        private Integer quantity;
        private BigDecimal price;
    }

    @Data
    @Builder
    public static class ProductSummary {
        private Long id;
        private String name;
        private BigDecimal price;
        private String imageUrl;
    }
}
