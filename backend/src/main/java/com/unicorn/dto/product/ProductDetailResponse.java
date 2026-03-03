package com.unicorn.dto.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductDetailResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Integer stock;
    private Long likesCount;
    private Boolean isLiked;
    private CategoryInfo category;
    private List<String> images;

    @Data
    @Builder
    public static class CategoryInfo {
        private Long id;
        private String name;
    }
}
