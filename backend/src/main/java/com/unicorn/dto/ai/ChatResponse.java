package com.unicorn.dto.ai;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatResponse {

    private String reply;
    private String conversationId;
}
