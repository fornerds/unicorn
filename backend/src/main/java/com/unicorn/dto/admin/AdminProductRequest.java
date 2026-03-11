package com.unicorn.dto.admin;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AdminProductRequest {

    @NotBlank
    private String name;

    private String company;

    @NotNull
    @DecimalMin("0")
    private BigDecimal price;

    /** 가격 단위. USD 또는 KRW (기본 USD) */
    private String currency = "USD";

    @NotNull
    private Long categoryId;

    @NotNull
    @Min(0)
    private Integer stock;

    /** 대표 이미지 URL (목록/썸네일용). 없으면 images 첫 항목 사용 */
    private String imageUrl;

    /** 상세 페이지 이미지 목록 */
    private List<String> images;
    
    private String weight;
    private String totalHeight;
    private String operatingTime;
    private String battery;
    private String speed;
    private String shortDescription;
    /** AI 채팅·카탈로그용 요약 (관리자 직접 작성) */
    private String aiSummary;
    private String content;

    /** 컬러별 재고. 있으면 product_color_stock 에 반영 */
    private List<AdminColorStockItem> colorStocks;
}
