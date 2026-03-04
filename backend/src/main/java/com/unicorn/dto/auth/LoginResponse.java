package com.unicorn.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {

    private String accessToken;

    @JsonIgnore
    private String refreshToken;
    private long expiresIn;
    private UserInfo user;

    @Data
    @Builder
    public static class UserInfo {
        private String email;
        private String name;
        private String phone;
        private Boolean marketingAgreed;
    }
}
