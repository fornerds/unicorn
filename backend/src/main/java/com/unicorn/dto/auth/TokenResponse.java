package com.unicorn.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TokenResponse {

    private String accessToken;

    @JsonIgnore
    private String refreshToken;
    private long expiresIn;
}
