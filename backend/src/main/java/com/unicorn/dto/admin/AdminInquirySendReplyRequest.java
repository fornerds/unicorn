package com.unicorn.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminInquirySendReplyRequest {

    @NotBlank(message = "답변 내용을 입력해 주세요.")
    private String message;
}
