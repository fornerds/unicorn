package com.unicorn.dto.ai;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class MoodQuestionResponse {

    private UUID id;
    private String question;
    private Integer sortOrder;
}
