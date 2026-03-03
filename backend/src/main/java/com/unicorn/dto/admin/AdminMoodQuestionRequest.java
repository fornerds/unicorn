package com.unicorn.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminMoodQuestionRequest {

    @NotBlank
    private String question;

    @NotNull
    private Integer sortOrder;
}
