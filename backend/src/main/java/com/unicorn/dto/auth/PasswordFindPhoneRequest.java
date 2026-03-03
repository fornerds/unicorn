package com.unicorn.dto.auth;

import lombok.Data;

@Data
public class PasswordFindPhoneRequest {

    private String phone;
    private String verifyCode;
    private String newPassword;
}
