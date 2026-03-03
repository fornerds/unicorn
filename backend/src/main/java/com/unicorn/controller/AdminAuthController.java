package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.auth.AdminLoginResponse;
import com.unicorn.dto.auth.LoginRequest;
import com.unicorn.dto.auth.RefreshRequest;
import com.unicorn.dto.auth.TokenResponse;
import com.unicorn.service.AdminAuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "관리자 - 인증", description = "관리자 로그인·토큰 재발급")
@RestController
@RequestMapping("/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @Operation(summary = "관리자 로그인")
    @PostMapping("/login")
    public ApiResponse<AdminLoginResponse> login(@Valid @RequestBody LoginRequest request) {
        AdminLoginResponse data = adminAuthService.login(request);
        return ApiResponse.success(data);
    }

    @Operation(summary = "관리자 토큰 재발급")
    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        TokenResponse data = adminAuthService.refreshAdmin(request.getRefreshToken());
        return ApiResponse.success(data);
    }
}
