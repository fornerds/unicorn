package com.unicorn.dto.ai;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/** AI 채팅용 제품 카탈로그 한 건. aiSummary 우선, 없으면 shortDescription 사용 */
@Data
@Builder
public class ProductCatalogItem {

    private Long id;
    private String name;
    private String categoryName;
    private BigDecimal price;
    private String summary;
}
