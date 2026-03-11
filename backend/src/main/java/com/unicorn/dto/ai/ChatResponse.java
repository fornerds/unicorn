package com.unicorn.dto.ai;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ChatResponse {

    private String reply;
    private String conversationId;
    private List<ChatProductCard> recommendedProducts;
}
