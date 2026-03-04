package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.auth.AdminLoginResponse;
import com.unicorn.dto.auth.LoginRequest;
import com.unicorn.dto.auth.TokenResponse;
import com.unicorn.service.AdminAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@Tag(name = "관리자 - 인증", description = "관리자 로그인·토큰 재발급")
@RestController
@RequestMapping("/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;
    private final com.unicorn.config.AuthCookieHelper authCookieHelper;

    @Operation(summary = "관리자 로그인", description = "응답에 Set-Cookie(access_token, refresh_token) 설정.")
    @PostMapping("/login")
    public ApiResponse<AdminLoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AdminLoginResponse data = adminAuthService.login(request);
        authCookieHelper.addAuthCookies(response, data.getAccessToken(), data.getRefreshToken());
        return ApiResponse.success(data);
    }

    @Operation(summary = "관리자 로그아웃", description = "쿠키 refresh_token으로 DB에서 해당 토큰 만료 후 쿠키 제거.")
    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = authCookieHelper.getRefreshTokenFromCookie(request);
        adminAuthService.invalidateRefreshToken(refreshToken);
        authCookieHelper.clearAuthCookies(response);
        return ApiResponse.success(null, "로그아웃되었습니다.");
    }

    @Operation(summary = "관리자 토큰 재발급", description = "쿠키 refresh_token으로만 재발급. Body 없이 POST만 하면 됨.")
    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(HttpServletRequest httpRequest, HttpServletResponse response) {
        String refreshToken = authCookieHelper.getRefreshTokenFromCookie(httpRequest);
        if (!StringUtils.hasText(refreshToken)) {
            throw new IllegalArgumentException("refresh_token 쿠키가 필요합니다. 관리자 로그인 후 쿠키가 설정되어 있어야 합니다.");
        }
        TokenResponse data = adminAuthService.refreshAdmin(refreshToken);
        authCookieHelper.addAuthCookies(response, data.getAccessToken(), data.getRefreshToken());
        return ApiResponse.success(data);
    }
}
