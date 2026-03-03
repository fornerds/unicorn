package com.unicorn.dto.auth;

import lombok.Data;

@Data
public class PasswordFindEmailRequest {

    private String email;

    private String token;

    private String newPassword;
}
