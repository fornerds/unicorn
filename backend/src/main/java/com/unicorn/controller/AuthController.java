package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.auth.*;
import com.unicorn.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "인증", description = "회원가입, 로그인, OAuth(네이버/카카오/구글), 비밀번호 찾기(이메일/전화번호)")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "로그인", description = "이메일·비밀번호 로그인")
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse data = authService.login(request);
        return ApiResponse.success(data);
    }

    @Operation(summary = "회원가입")
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LoginResponse> signup(@Valid @RequestBody SignupRequest request) {
        LoginResponse data = authService.signup(request);
        return ApiResponse.created(data);
    }

    @Operation(summary = "토큰 재발급", description = "Refresh 토큰으로 Access/Refresh 재발급")
    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@Valid @RequestBody RefreshRequest request) {
        TokenResponse data = authService.refreshUser(request.getRefreshToken());
        return ApiResponse.success(data);
    }

    @Operation(summary = "네이버 로그인/가입")
    @PostMapping("/naver")
    public ApiResponse<LoginResponse> naver(@RequestBody OAuthLoginRequest request) {
        if (request.getAccessToken() == null || request.getAccessToken().isBlank()) {
            throw new IllegalArgumentException("accessToken이 필요합니다.");
        }
        LoginResponse data = authService.loginWithNaver(request.getAccessToken(), request.getName(), request.getEmail());
        return ApiResponse.success(data);
    }

    @Operation(summary = "카카오 로그인/가입")
    @PostMapping("/kakao")
    public ApiResponse<LoginResponse> kakao(@RequestBody OAuthLoginRequest request) {
        if (request.getAccessToken() == null || request.getAccessToken().isBlank()) {
            throw new IllegalArgumentException("accessToken이 필요합니다.");
        }
        LoginResponse data = authService.loginWithKakao(request.getAccessToken(), request.getName(), request.getEmail());
        return ApiResponse.success(data);
    }

    @Operation(summary = "구글 로그인/가입")
    @PostMapping("/google")
    public ApiResponse<LoginResponse> google(@RequestBody OAuthLoginRequest request) {
        if (request.getAccessToken() == null || request.getAccessToken().isBlank()) {
            throw new IllegalArgumentException("accessToken이 필요합니다.");
        }
        LoginResponse data = authService.loginWithGoogle(request.getAccessToken(), request.getName(), request.getEmail());
        return ApiResponse.success(data);
    }

    @Operation(summary = "이메일 비밀번호 찾기", description = "인증: 이메일 발송 / 재설정: token + newPassword")
    @PostMapping("/password/find/email")
    public ApiResponse<PasswordFindEmailResponse> passwordFindEmail(@RequestBody PasswordFindEmailRequest request) {
        if (request.getToken() != null && !request.getToken().isBlank()
                && request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            PasswordFindEmailResponse data = authService.resetPasswordWithToken(request.getToken(), request.getNewPassword());
            return ApiResponse.success(data, "비밀번호가 변경되었습니다.");
        }
        if (request.getEmail() != null && !request.getEmail().isBlank()) {
            PasswordFindEmailResponse data = authService.requestPasswordResetByEmail(request.getEmail());
            return ApiResponse.success(data, "이메일로 인증 링크를 발송했습니다.");
        }
        throw new IllegalArgumentException("이메일을 입력하거나, 재설정 시 토큰과 새 비밀번호를 입력하세요.");
    }

    @Operation(summary = "전화번호 비밀번호 찾기", description = "인증: 인증번호 발송 / 재설정: SMS 연동 후 지원")
    @PostMapping("/password/find/phone")
    public ApiResponse<PasswordFindPhoneResponse> passwordFindPhone(@RequestBody PasswordFindPhoneRequest request) {
        if (request.getPhone() != null && !request.getPhone().isBlank()
                && request.getVerifyCode() != null && !request.getVerifyCode().isBlank()
                && request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            PasswordFindPhoneResponse data = authService.resetPasswordWithPhone(request.getPhone(), request.getVerifyCode(), request.getNewPassword());
            return ApiResponse.success(data, "비밀번호가 변경되었습니다.");
        }
        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            PasswordFindPhoneResponse data = authService.requestPasswordResetByPhone(request.getPhone());
            return ApiResponse.success(data, "인증번호를 발송했습니다.");
        }
        throw new IllegalArgumentException("전화번호를 입력하거나, 재설정 시 전화번호·인증번호·새 비밀번호를 입력하세요.");
    }
}
