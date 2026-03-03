package com.unicorn.dto.auth;

import lombok.Data;

@Data
public class OAuthLoginRequest {

    private String accessToken;
    private String name;
    private String email;
}
