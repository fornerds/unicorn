package com.unicorn.dto.ai;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/** AI 채팅용 제품 카탈로그 한 건. 가격·크기·배터리·속도·요약 등으로 상담·추천에 활용 */
@Data
@Builder
public class ProductCatalogItem {

    private Long id;
    private String name;
    private String categoryName;
    private BigDecimal price;
    private String currency;
    private String weight;
    private String totalHeight;
    private String operatingTime;
    private String battery;
    private String speed;
    private String summary;
}
