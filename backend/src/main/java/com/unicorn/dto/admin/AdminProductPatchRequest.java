package com.unicorn.dto.admin;

import lombok.Data;

import java.util.List;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Data
public class AdminProductPatchRequest {

    @Size(max = 200)
    private String name;

    @DecimalMin("0")
    private BigDecimal price;

    @Size(max = 3)
    private String currency;

    @Min(0)
    private Integer stock;

    /** 대표 이미지 URL (목록/썸네일용). 상세 이미지와 별도. */
    private String imageUrl;

    /** 상세 페이지 이미지 목록 (갤러리용) */
    private java.util.List<String> images;

    private String weight;
    private String totalHeight;
    private String operatingTime;
    private String battery;
    private String speed;
    private String shortDescription;
    private String aiSummary;
    private String content;

    /** 컬러별 재고. 있으면 product_color_stock 을 이 목록으로 교체 */
    private List<AdminColorStockItem> colorStocks;
}
