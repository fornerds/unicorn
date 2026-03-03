package com.unicorn.dto.ai;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MoodQuestionResponse {

    private Long id;
    private String question;
    private Integer sortOrder;
}
