package com.unicorn.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SignupRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8)
    private String password;

    @NotBlank
    @Size(max = 100)
    private String name;

    @Size(max = 20)
    private String phone;

    /** 마케팅 수신 동의 여부. true면 동의, false/미전송이면 비동의 */
    private Boolean marketingAgreed;
}
