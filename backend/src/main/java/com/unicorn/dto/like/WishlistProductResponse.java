package com.unicorn.dto.like;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class WishlistProductResponse {

    private Long id;
    private String name;
    private CategorySummary category;
    private CategorySummary parentCategory;
    private Integer stock;
    private BigDecimal price;
    private List<String> colors;

    @Data
    @Builder
    public static class CategorySummary {
        private Long id;
        private String name;
    }
}
