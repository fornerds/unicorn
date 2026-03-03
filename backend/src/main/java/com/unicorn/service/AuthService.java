package com.unicorn.service;

import com.unicorn.dto.auth.*;
import com.unicorn.entity.PasswordResetToken;
import com.unicorn.entity.RefreshToken;
import com.unicorn.entity.SnsAccount;
import com.unicorn.entity.User;
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
    public LoginResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .phone(request.getPhone())
                .status("active")
                .build();
        user = userRepository.save(user);

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
    public TokenResponse refreshUser(String refreshTokenValue) {
        if (!jwtUtil.validateRefreshToken(refreshTokenValue)) {
            throw new IllegalArgumentException("유효하지 않은 refresh 토큰입니다.");
        }
        UUID subjectId = jwtUtil.extractSubjectIdFromRefresh(refreshTokenValue);
        String subjectType = jwtUtil.extractSubjectTypeFromRefresh(refreshTokenValue);
        if (!JwtUtil.SUBJECT_TYPE_USER.equals(subjectType)) {
            throw new IllegalArgumentException("유효하지 않은 refresh 토큰입니다.");
        }

        String hash = TokenHashUtil.hash(refreshTokenValue);
        RefreshToken stored = refreshTokenRepository.findByTokenHashAndExpiresAtAfter(hash, Instant.now())
                .orElseThrow(() -> new IllegalArgumentException("이미 사용된 refresh 토큰이거나 만료되었습니다."));

        refreshTokenRepository.delete(stored);

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

    @Transactional(readOnly = true)
    public PasswordFindPhoneResponse requestPasswordResetByPhone(String phone) {
        return PasswordFindPhoneResponse.builder().sent(true).build();
    }

    @Transactional
    public PasswordFindPhoneResponse resetPasswordWithPhone(String phone, String verifyCode, String newPassword) {
        throw new IllegalArgumentException("전화번호 비밀번호 재설정은 SMS 연동 후 이용 가능합니다.");
    }

    @Transactional
    public PasswordFindEmailResponse requestPasswordResetByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElse(null);
        if (user == null || user.getPasswordHash() == null) {
            return PasswordFindEmailResponse.builder().sent(true).build();
        }
        passwordResetTokenRepository.deleteByUserId(user.getId());
        String rawToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString().replace("-", "");
        String tokenHash = TokenHashUtil.hash(rawToken);
        Instant expiresAt = Instant.now().plusSeconds(tokenValidityMinutes * 60L);
        PasswordResetToken prt = PasswordResetToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(expiresAt)
                .build();
        passwordResetTokenRepository.save(prt);
        String resetLink = passwordResetBaseUrl + "/password-reset?token=" + rawToken;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        return PasswordFindEmailResponse.builder().sent(true).build();
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

    private void saveUserRefreshToken(UUID userId, String refreshTokenValue) {
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
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .avatar(user.getAvatar())
                .phone(user.getPhone())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .updatedAt(user.getUpdatedAt() != null ? user.getUpdatedAt().toString() : null)
                .build();
    }
}
