package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.auth.AdminLoginResponse;
import com.unicorn.dto.auth.LoginRequest;
import com.unicorn.dto.auth.RefreshRequest;
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

    @Operation(summary = "관리자 로그아웃", description = "클라이언트 쿠키만 제거. DB의 refresh 토큰은 삭제하지 않음.")
    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse response) {
        authCookieHelper.clearAuthCookies(response);
        return ApiResponse.success(null, "로그아웃되었습니다.");
    }

    @Operation(summary = "관리자 토큰 재발급", description = "Body 또는 refresh_token 쿠키로 재발급. 새 토큰은 Set-Cookie로 설정.")
    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestBody RefreshRequest request, HttpServletRequest httpRequest, HttpServletResponse response) {
        String refreshToken = StringUtils.hasText(request.getRefreshToken())
                ? request.getRefreshToken()
                : authCookieHelper.getRefreshTokenFromCookie(httpRequest);
        if (!StringUtils.hasText(refreshToken)) {
            throw new IllegalArgumentException("refreshToken이 필요합니다. Body 또는 refresh_token 쿠키를 보내주세요.");
        }
        TokenResponse data = adminAuthService.refreshAdmin(refreshToken);
        authCookieHelper.addAuthCookies(response, data.getAccessToken(), data.getRefreshToken());
        return ApiResponse.success(data);
    }
}
