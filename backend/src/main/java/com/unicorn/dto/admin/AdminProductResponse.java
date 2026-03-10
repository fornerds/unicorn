package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class AdminProductResponse {

    private Long id;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private Integer stock;
    private List<AdminColorStockItem> colorStocks;
    private Long categoryId;
    private String categoryName;
    private Long parentCategoryId;
    private String parentCategoryName;
    private List<String> images;
    private String weight;
    private String totalHeight;
    private String operatingTime;
    private String battery;
    private String speed;
    private String shortDescription;
    private String content;
    private Instant createdAt;
    private Instant updatedAt;
}
