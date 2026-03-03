package com.unicorn.config;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class AuthCookieHelper {

    private final JwtProperties jwtProperties;

    @Value("${app.jwt.cookie-secure:false}")
    private boolean cookieSecure;

    private static final String COOKIE_PATH = "/";
    private static final String SAME_SITE_LAX = "Lax";

    public void addAuthCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        int accessMaxAge = (int) (jwtProperties.getAccessExpirationMs() / 1000);
        int refreshMaxAge = (int) (jwtProperties.getRefreshExpirationMs() / 1000);
        addCookie(response, jwtProperties.getAccessTokenCookieName(), accessToken, accessMaxAge);
        addCookie(response, jwtProperties.getRefreshTokenCookieName(), refreshToken, refreshMaxAge);
    }

    private void addCookie(HttpServletResponse response, String name, String value, int maxAgeSeconds) {
        String cookie = name + "=" + value
                + "; Path=" + COOKIE_PATH
                + "; Max-Age=" + maxAgeSeconds
                + "; HttpOnly"
                + "; SameSite=" + SAME_SITE_LAX;
        if (cookieSecure) {
            cookie += "; Secure";
        }
        response.addHeader("Set-Cookie", cookie);
    }

    public String getRefreshTokenFromCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return null;
        }
        return Arrays.stream(cookies)
                .filter(c -> jwtProperties.getRefreshTokenCookieName().equals(c.getName()))
                .map(Cookie::getValue)
                .filter(StringUtils::hasText)
                .findFirst()
                .orElse(null);
    }

    public void clearAuthCookies(HttpServletResponse response) {
        addCookie(response, jwtProperties.getAccessTokenCookieName(), "", 0);
        addCookie(response, jwtProperties.getRefreshTokenCookieName(), "", 0);
    }
}
