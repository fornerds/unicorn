package com.unicorn.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminTagRequest {

    @NotBlank(message = "태그 이름은 필수입니다.")
    private String name;
}
