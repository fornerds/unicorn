package com.unicorn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 메시지/상태만 내려주는 API 응답용. data 필드에 { message, success } 형태로 사용.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {

    private String message;
    private Boolean success;

    public static MessageResponse of(String message) {
        return MessageResponse.builder().message(message).build();
    }

    public static MessageResponse of(String message, boolean success) {
        return MessageResponse.builder().message(message).success(success).build();
    }
}
