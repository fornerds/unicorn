package com.unicorn.dto.auth;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class AdminLoginResponse {

    private String accessToken;
    private String refreshToken;
    private long expiresIn;
    private AdminInfo admin;

    @Data
    @Builder
    public static class AdminInfo {
        private UUID id;
        private String email;
        private String name;
        private String role;
    }
}
