package com.unicorn.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtProperties {

    private String accessTokenCookieName = "access_token";
    private String refreshTokenCookieName = "refresh_token";
    private String accessSecret;
    private String refreshSecret;
    private long accessExpirationMs = 3600000L;
    private long refreshExpirationMs = 604800000L;
}
