package com.unicorn.service;

import com.unicorn.dto.auth.*;
import com.unicorn.entity.PasswordResetToken;
import com.unicorn.entity.RefreshToken;
import com.unicorn.entity.SnsAccount;
import com.unicorn.entity.User;
import com.unicorn.entity.EmailVerification;
import com.unicorn.repository.EmailVerificationRepository;
import com.unicorn.repository.PasswordResetTokenRepository;
import com.unicorn.repository.RefreshTokenRepository;
import com.unicorn.repository.SnsAccountRepository;
import com.unicorn.repository.UserRepository;
import com.unicorn.service.OAuthProviderService.OAuthUserInfo;
import com.unicorn.util.JwtUtil;
import com.unicorn.util.TokenHashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final SnsAccountRepository snsAccountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final OAuthProviderService oAuthProviderService;

    @Value("${app.password-reset.base-url:http://localhost:3000}")
    private String passwordResetBaseUrl;

    @Value("${app.password-reset.token-validity-minutes:60}")
    private int tokenValidityMinutes;

    @Value("${app.oauth.callback-base-url:http://localhost:18080/api/v1}")
    private String oauthCallbackBaseUrl;

    @Value("${app.oauth.frontend-redirect-url:http://localhost:3000}")
    private String oauthFrontendRedirectUrl;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));
        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
        if ("suspended".equals(user.getStatus())) {
            throw new IllegalArgumentException("정지된 계정입니다.");
        }
        if ("ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("관리자 계정은 관리자 로그인을 이용하세요.");
        }
        String role = user.getRole() != null && !user.getRole().isBlank() ? user.getRole() : "USER";
        String accessToken = jwtUtil.generateAccessToken(user.getId(), JwtUtil.SUBJECT_TYPE_USER, user.getEmail(), role);
        String refreshTokenValue = jwtUtil.generateRefreshToken(user.getId(), JwtUtil.SUBJECT_TYPE_USER);
        saveUserRefreshToken(user.getId(), refreshTokenValue);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .expiresIn(jwtUtil.getAccessExpirationMs() / 1000)
                .user(toUserInfo(user))
                .build();
    }

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        EmailVerification verification = emailVerificationRepository
                .findFirstByEmailAndPurposeOrderByCreatedAtDesc(request.getEmail(), "SIGNUP")
                .orElseThrow(() -> new IllegalArgumentException("이메일 인증 내역이 없습니다."));

        if (!Boolean.TRUE.equals(verification.getVerified())) {
            throw new IllegalArgumentException("이메일 인증이 완료되지 않았습니다.");
        }

        // 인증된 상태라면 만료 시간은 체크하지 않거나,
        // 필요하다면 인증 완료 후 일정 시간(예: 30분) 내에만 가입 가능하도록 별도의 만료 로직을 둘 수 있습니다.
        // 현재는 인증만 완료되었다면 가입을 허용합니다.

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .marketingAgreed(Boolean.TRUE.equals(request.getMarketingAgreed()))
                .status("active")
                .build();
        userRepository.save(user);

        // 사용 완료된 인증 정보는 삭제
        emailVerificationRepository.delete(verification);
    }

    @Transactional
    public TokenResponse refreshUser(String refreshTokenValue) {
        if (!jwtUtil.validateRefreshToken(refreshTokenValue)) {
            throw new IllegalArgumentException("유효하지 않은 refresh 토큰입니다.");
        }
        Long subjectId = jwtUtil.extractSubjectIdFromRefresh(refreshTokenValue);
        String subjectType = jwtUtil.extractSubjectTypeFromRefresh(refreshTokenValue);
        if (!JwtUtil.SUBJECT_TYPE_USER.equals(subjectType)) {
            throw new IllegalArgumentException("유효하지 않은 refresh 토큰입니다.");
        }

        String hash = TokenHashUtil.hash(refreshTokenValue);
        RefreshToken stored = refreshTokenRepository.findFirstByTokenHashAndExpiresAtAfterOrderByIdDesc(hash, Instant.now())
                .orElseThrow(() -> new IllegalArgumentException("이미 사용된 refresh 토큰이거나 만료되었습니다."));

        stored.setExpiresAt(Instant.now());
        refreshTokenRepository.save(stored);

        User user = userRepository.findById(subjectId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        String role = user.getRole() != null && !user.getRole().isBlank() ? user.getRole() : "USER";
        String newAccess = jwtUtil.generateAccessToken(user.getId(), JwtUtil.SUBJECT_TYPE_USER, user.getEmail(), role);
        String newRefresh = jwtUtil.generateRefreshToken(user.getId(), JwtUtil.SUBJECT_TYPE_USER);
        saveUserRefreshToken(user.getId(), newRefresh);

        return TokenResponse.builder()
                .accessToken(newAccess)
                .refreshToken(newRefresh)
                .expiresIn(jwtUtil.getAccessExpirationMs() / 1000)
                .build();
    }

    @Transactional
    public LoginResponse loginWithNaver(String accessToken, String requestName, String requestEmail) {
        OAuthUserInfo info = oAuthProviderService.getNaverUserInfo(accessToken);
        return findOrCreateUserAndIssueToken("naver", info, requestName, requestEmail);
    }

    @Transactional
    public LoginResponse loginWithKakao(String accessToken, String requestName, String requestEmail) {
        OAuthUserInfo info = oAuthProviderService.getKakaoUserInfo(accessToken);
        return findOrCreateUserAndIssueToken("kakao", info, requestName, requestEmail);
    }

    @Transactional
    public LoginResponse loginWithGoogle(String accessToken, String requestName, String requestEmail) {
        OAuthUserInfo info = oAuthProviderService.getGoogleUserInfo(accessToken);
        return findOrCreateUserAndIssueToken("google", info, requestName, requestEmail);
    }

    private static final String OAUTH_CALLBACK_PATH = "/auth/callback";

    @Transactional
    public LoginResponse loginWithOAuthCallback(String code, String state) {
        String platform = parsePlatformFromState(state);
        String redirectUri = oauthCallbackBaseUrl + OAUTH_CALLBACK_PATH;
        switch (platform) {
            case "naver" -> {
                String accessToken = oAuthProviderService.exchangeCodeForNaverToken(code, state, redirectUri);
                return loginWithNaver(accessToken, null, null);
            }
            case "kakao" -> {
                String accessToken = oAuthProviderService.exchangeCodeForKakaoToken(code, redirectUri);
                return loginWithKakao(accessToken, null, null);
            }
            case "google" -> {
                String accessToken = oAuthProviderService.exchangeCodeForGoogleToken(code, redirectUri);
                return loginWithGoogle(accessToken, null, null);
            }
            default -> throw new IllegalArgumentException("지원하지 않는 OAuth 플랫폼입니다: " + platform);
        }
    }

    private static String parsePlatformFromState(String state) {
        if (state == null || state.isBlank() || !state.contains(":")) {
            throw new IllegalArgumentException("state에서 플랫폼을 확인할 수 없습니다.");
        }
        String platform = state.split(":")[0].trim().toLowerCase();
        if (!platform.matches("naver|kakao|google")) {
            throw new IllegalArgumentException("지원하지 않는 OAuth 플랫폼입니다: " + platform);
        }
        return platform;
    }

    public String getOauthFrontendRedirectUrl() {
        return oauthFrontendRedirectUrl;
    }

    /** 로그아웃 시 해당 refresh 토큰을 즉시 만료. 탈취되어도 재사용 불가. */
    @Transactional
    public void invalidateRefreshToken(String refreshTokenValue) {
        if (refreshTokenValue == null || refreshTokenValue.isBlank()) {
            return;
        }
        String hash = TokenHashUtil.hash(refreshTokenValue);
        refreshTokenRepository.findByTokenHash(hash).ifPresent(rt -> {
            rt.setExpiresAt(Instant.now());
            refreshTokenRepository.save(rt);
        });
    }

    private LoginResponse findOrCreateUserAndIssueToken(String provider, OAuthUserInfo info, String requestName, String requestEmail) {
        String email = (info.email() != null && !info.email().isBlank()) ? info.email() : requestEmail;
        String name = (info.name() != null && !info.name().isBlank()) ? info.name() : requestName;
        if (email == null || email.isBlank()) {
            email = provider + "_" + info.providerUserId() + "@sns.unicorn.local";
        }
        if (name == null || name.isBlank()) {
            name = provider + " 사용자";
        }
        final String finalEmail = email;
        final String finalName = name;
        User user = snsAccountRepository.findByProviderAndProviderUserId(provider, info.providerUserId())
                .map(SnsAccount::getUser)
                .orElseGet(() -> {
                    User newUser = userRepository.findByEmail(finalEmail).orElse(null);
                    if (newUser != null) {
                        SnsAccount link = SnsAccount.builder()
                                .user(newUser)
                                .provider(provider)
                                .providerUserId(info.providerUserId())
                                .build();
                        snsAccountRepository.save(link);
                        return newUser;
                    }
                    newUser = User.builder()
                            .email(finalEmail)
                            .passwordHash(null)
                            .name(finalName)
                            .status("active")
                            .build();
                    newUser = userRepository.save(newUser);
                    SnsAccount link = SnsAccount.builder()
                            .user(newUser)
                            .provider(provider)
                            .providerUserId(info.providerUserId())
                            .build();
                    snsAccountRepository.save(link);
                    return newUser;
                });
        if ("suspended".equals(user.getStatus())) {
            throw new IllegalArgumentException("정지된 계정입니다.");
        }
        String accessToken = jwtUtil.generateAccessToken(user.getId(), JwtUtil.SUBJECT_TYPE_USER, user.getEmail(), "USER");
        String refreshTokenValue = jwtUtil.generateRefreshToken(user.getId(), JwtUtil.SUBJECT_TYPE_USER);
        saveUserRefreshToken(user.getId(), refreshTokenValue);
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .expiresIn(jwtUtil.getAccessExpirationMs() / 1000)
                .user(toUserInfo(user))
                .build();
    }

    @Transactional
    public void sendEmailVerificationCode(String email, String purpose) {
        if ("SIGNUP".equals(purpose) && userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        if ("FIND_PASSWORD".equals(purpose) && !userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("가입되지 않은 이메일입니다.");
        }

        String code = String.format("%06d", (int)(Math.random() * 1000000));
        Instant expiresAt = Instant.now().plusSeconds(3 * 60L); // 3분 유효

        EmailVerification verification = EmailVerification.builder()
                .email(email)
                .verificationCode(code)
                .purpose(purpose)
                .expiresAt(expiresAt)
                .verified(false)
                .build();
        emailVerificationRepository.save(verification);

        String purposeText = "SIGNUP".equals(purpose) ? "회원가입" : "비밀번호 찾기";
        emailService.sendVerificationCodeEmail(email, code, purposeText);
    }

    @Transactional
    public void verifyEmailCode(String email, String code, String purpose) {
        EmailVerification verification = emailVerificationRepository
                .findFirstByEmailAndPurposeOrderByCreatedAtDesc(email, purpose)
                .orElseThrow(() -> new IllegalArgumentException("인증 내역이 없습니다. 인증번호를 다시 요청해 주세요."));

        if (Instant.now().isAfter(verification.getExpiresAt())) {
            throw new IllegalArgumentException("인증번호가 만료되었습니다.");
        }

        if (!verification.getVerificationCode().equals(code)) {
            throw new IllegalArgumentException("인증번호가 일치하지 않습니다.");
        }

        verification.setVerified(true);
        emailVerificationRepository.save(verification);
    }

    @Transactional(readOnly = true)
    public PasswordFindPhoneResponse requestPasswordResetByPhone(String phone) {
        return PasswordFindPhoneResponse.builder().sent(true).build();
    }

    @Transactional
    public PasswordFindPhoneResponse resetPasswordWithPhone(String phone, String verifyCode, String newPassword) {
        throw new IllegalArgumentException("전화번호 비밀번호 재설정은 SMS 연동 후 이용 가능합니다.");
    }

    @Transactional
    public PasswordFindEmailResponse verifyPasswordFindCode(String email, String code) {
        EmailVerification verification = emailVerificationRepository
                .findFirstByEmailAndPurposeOrderByCreatedAtDesc(email, "FIND_PASSWORD")
                .orElseThrow(() -> new IllegalArgumentException("인증 내역이 없습니다."));

        if (!verification.getVerificationCode().equals(code)) {
             throw new IllegalArgumentException("인증번호가 일치하지 않습니다.");
        }
        
        if (Instant.now().isAfter(verification.getExpiresAt())) {
             throw new IllegalArgumentException("인증번호가 만료되었습니다.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 인증 확인됨 (사용 완료 처리)
        emailVerificationRepository.delete(verification);

        // 이전 재설정 토큰들 삭제
        passwordResetTokenRepository.deleteByUserId(user.getId());

        // 새로운 1회용 재설정 토큰 발급 (30분 유효)
        String rawToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString().replace("-", "");
        String tokenHash = TokenHashUtil.hash(rawToken);
        Instant expiresAt = Instant.now().plusSeconds(30 * 60L);
        
        PasswordResetToken prt = PasswordResetToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(expiresAt)
                .build();
        passwordResetTokenRepository.save(prt);

        return PasswordFindEmailResponse.builder()
                .success(true)
                .resetToken(rawToken) // 이 토큰을 프론트에 내려줌
                .build();
    }

    @Transactional
    public PasswordFindEmailResponse resetPasswordWithToken(String token, String newPassword) {
        if (token == null || token.isBlank() || newPassword == null || newPassword.isBlank()) {
            throw new IllegalArgumentException("토큰과 새 비밀번호가 필요합니다.");
        }
        String tokenHash = TokenHashUtil.hash(token);
        PasswordResetToken prt = passwordResetTokenRepository.findByTokenHashAndExpiresAtAfter(tokenHash, Instant.now())
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않거나 만료된 링크입니다."));
        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        passwordResetTokenRepository.delete(prt);
        return PasswordFindEmailResponse.builder().success(true).build();
    }

    private void saveUserRefreshToken(Long userId, String refreshTokenValue) {
        String hash = TokenHashUtil.hash(refreshTokenValue);
        Instant expiresAt = Instant.now().plusMillis(jwtUtil.getRefreshExpirationMs());
        RefreshToken rt = RefreshToken.builder()
                .tokenHash(hash)
                .expiresAt(expiresAt)
                .build();
        rt.setUser(userRepository.getReferenceById(userId));
        refreshTokenRepository.save(rt);
    }

    private LoginResponse.UserInfo toUserInfo(User user) {
        return LoginResponse.UserInfo.builder()
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .marketingAgreed(user.getMarketingAgreed())
                .build();
    }
}
