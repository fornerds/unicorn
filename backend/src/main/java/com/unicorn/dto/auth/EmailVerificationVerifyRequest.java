package com.unicorn.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailVerificationVerifyRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String code;
}