package com.unicorn.dto.product;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ProductListResponse {

    private Long id;
    private String name;
    private String company;
    private String imageUrl;
    private BigDecimal price;
    private Boolean isLiked;
    private CategorySummary parentCategory;
    private CategorySummary category;

    @Data
    @Builder
    public static class CategorySummary {
        private Long id;
        private String name;
    }
}
