package com.unicorn.dto.product;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class ProductDetailResponse {

    private Long id;
    private String name;
    private String company;
    private String imageUrl;
    private List<String> images;
    private CategoryInfo parentCategory;
    private CategoryInfo category;
    private Boolean isLiked;
    private List<ColorStock> colorStocks;
    private BigDecimal price;
    private ProductDetail detail;
    private String shortDescription;
    private String content;

    @Data
    @Builder
    public static class ColorStock {
        private String color;
        private String colorCode;
        private Integer stock;
    }

    @Data
    @Builder
    public static class CategoryInfo {
        private Long id;
        private String name;
        private String slug;
    }

    @Data
    @Builder
    public static class ProductDetail {
        private String weight;
        private String totalHeight;
        private String operatingTime;
        private String battery;
        private String speed;
    }
}
