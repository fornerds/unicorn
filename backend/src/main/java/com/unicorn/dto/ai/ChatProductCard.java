package com.unicorn.dto.ai;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

/** AI 채팅 응답에 포함되는 추천 제품 카드용 DTO */
@Data
@Builder
public class ChatProductCard {

    private Long id;
    private String name;
    private BigDecimal price;
    private String imageUrl;
    private String category;
    private String companyName;
}
