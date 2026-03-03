package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.auth.*;
import com.unicorn.service.AuthService;
import com.unicorn.service.OAuthProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.UUID;

@Tag(name = "인증", description = "회원가입, 로그인, OAuth(네이버/카카오/구글), 비밀번호 찾기(이메일/전화번호)")
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OAuthProviderService oAuthProviderService;
    private final com.unicorn.config.AuthCookieHelper authCookieHelper;

    @Operation(summary = "로그인", description = "이메일·비밀번호 로그인. 응답에 Set-Cookie(access_token, refresh_token) 설정.")
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        LoginResponse data = authService.login(request);
        authCookieHelper.addAuthCookies(response, data.getAccessToken(), data.getRefreshToken());
        return ApiResponse.success(data);
    }

    @Operation(summary = "회원가입", description = "가입 후 로그인 처리. Set-Cookie(access_token, refresh_token) 설정.")
    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<LoginResponse> signup(@Valid @RequestBody SignupRequest request, HttpServletResponse response) {
        LoginResponse data = authService.signup(request);
        authCookieHelper.addAuthCookies(response, data.getAccessToken(), data.getRefreshToken());
        return ApiResponse.created(data);
    }

    @Operation(summary = "로그아웃", description = "클라이언트 쿠키(access_token, refresh_token)만 제거. DB의 refresh 토큰은 삭제하지 않음(로그인 이력 보관).")
    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletResponse response) {
        authCookieHelper.clearAuthCookies(response);
        return ApiResponse.success(null, "로그아웃되었습니다.");
    }

    @Operation(summary = "토큰 재발급", description = "Body의 refreshToken 또는 쿠키 refresh_token으로 Access/Refresh 재발급. 새 토큰은 Set-Cookie로 설정.")
    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestBody RefreshRequest request, HttpServletRequest httpRequest, HttpServletResponse response) {
        String refreshToken = StringUtils.hasText(request.getRefreshToken())
                ? request.getRefreshToken()
                : authCookieHelper.getRefreshTokenFromCookie(httpRequest);
        if (!StringUtils.hasText(refreshToken)) {
            throw new IllegalArgumentException("refreshToken이 필요합니다. Body 또는 refresh_token 쿠키를 보내주세요.");
        }
        TokenResponse data = authService.refreshUser(refreshToken);
        authCookieHelper.addAuthCookies(response, data.getAccessToken(), data.getRefreshToken());
        return ApiResponse.success(data);
    }

    @Operation(summary = "네이버 인증 URL 조회", description = "화면에서 이 URL로 이동하면 네이버 로그인 후 GET /auth/callback으로 code·state 리다이렉트")
    @GetMapping("/oauth/naver/authorize-url")
    public ApiResponse<OAuthAuthorizeUrlResponse> getNaverAuthorizeUrl() {
        String state = "naver:" + UUID.randomUUID();
        String url = oAuthProviderService.buildNaverAuthorizeUrl(state);
        return ApiResponse.success(OAuthAuthorizeUrlResponse.builder().url(url).state(state).build());
    }

    @Operation(summary = "카카오 인증 URL 조회", description = "화면에서 이 URL로 이동하면 카카오 로그인 후 GET /auth/callback으로 code·state 리다이렉트")
    @GetMapping("/oauth/kakao/authorize-url")
    public ApiResponse<OAuthAuthorizeUrlResponse> getKakaoAuthorizeUrl() {
        String state = "kakao:" + UUID.randomUUID();
        String url = oAuthProviderService.buildKakaoAuthorizeUrl(state);
        return ApiResponse.success(OAuthAuthorizeUrlResponse.builder().url(url).state(state).build());
    }

    @Operation(summary = "구글 인증 URL 조회", description = "화면에서 이 URL로 이동하면 구글 로그인 후 GET /auth/callback으로 code·state 리다이렉트")
    @GetMapping("/oauth/google/authorize-url")
    public ApiResponse<OAuthAuthorizeUrlResponse> getGoogleAuthorizeUrl() {
        String state = "google:" + UUID.randomUUID();
        String url = oAuthProviderService.buildGoogleAuthorizeUrl(state);
        return ApiResponse.success(OAuthAuthorizeUrlResponse.builder().url(url).state(state).build());
    }

    @Operation(summary = "OAuth 콜백 (통합)", description = "네이버/카카오/구글 로그인 후 제공자가 이 URL로 code·state 리다이렉트. Set-Cookie(access_token, refresh_token) 설정 후 프론트로 리다이렉트.")
    @GetMapping("/callback")
    public RedirectView callback(@RequestParam String code, @RequestParam(required = false) String state, HttpServletResponse response) {
        LoginResponse data = authService.loginWithOAuthCallback(code, state);
        authCookieHelper.addAuthCookies(response, data.getAccessToken(), data.getRefreshToken());
        String base = authService.getOauthFrontendRedirectUrl();
        String url = base + "?accessToken=" + data.getAccessToken() + "&refreshToken=" + data.getRefreshToken() + "&expiresIn=" + data.getExpiresIn();
        return new RedirectView(url);
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
