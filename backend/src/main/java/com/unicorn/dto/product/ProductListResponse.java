package com.unicorn.dto.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductListResponse {

    private Long id;
    private String name;
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
