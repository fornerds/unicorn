package com.unicorn.service;

import com.unicorn.dto.auth.AdminLoginResponse;
import com.unicorn.dto.auth.LoginRequest;
import com.unicorn.dto.auth.TokenResponse;
import com.unicorn.entity.RefreshToken;
import com.unicorn.entity.User;
import com.unicorn.repository.RefreshTokenRepository;
import com.unicorn.util.TokenHashUtil;
import com.unicorn.repository.UserRepository;
import com.unicorn.util.JwtUtil;
import com.unicorn.util.TokenHashUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private static final String ADMIN_ROLE = "ADMIN";

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AdminLoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmailAndRole(request.getEmail(), ADMIN_ROLE)
                .orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String role = user.getRole() != null && !user.getRole().isBlank() ? user.getRole() : ADMIN_ROLE;
        String accessToken = jwtUtil.generateAccessToken(user.getId(), JwtUtil.SUBJECT_TYPE_ADMIN, user.getEmail(), role);
        String refreshTokenValue = jwtUtil.generateRefreshToken(user.getId(), JwtUtil.SUBJECT_TYPE_ADMIN);
        saveRefreshToken(user.getId(), refreshTokenValue);

        return AdminLoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .expiresIn(jwtUtil.getAccessExpirationMs() / 1000)
                .admin(AdminLoginResponse.AdminInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .role(user.getRole())
                        .build())
                .build();
    }

    @Transactional
    public TokenResponse refreshAdmin(String refreshTokenValue) {
        if (!jwtUtil.validateRefreshToken(refreshTokenValue)) {
            throw new IllegalArgumentException("유효하지 않은 refresh 토큰입니다.");
        }
        Long subjectId = jwtUtil.extractSubjectIdFromRefresh(refreshTokenValue);
        String subjectType = jwtUtil.extractSubjectTypeFromRefresh(refreshTokenValue);
        if (!JwtUtil.SUBJECT_TYPE_ADMIN.equals(subjectType)) {
            throw new IllegalArgumentException("유효하지 않은 refresh 토큰입니다.");
        }

        String hash = TokenHashUtil.hash(refreshTokenValue);
        RefreshToken stored = refreshTokenRepository.findByTokenHashAndExpiresAtAfter(hash, Instant.now())
                .orElseThrow(() -> new IllegalArgumentException("이미 사용된 refresh 토큰이거나 만료되었습니다."));

        refreshTokenRepository.delete(stored);

        User user = userRepository.findById(subjectId).orElseThrow(() -> new IllegalArgumentException("관리자를 찾을 수 없습니다."));
        if (!ADMIN_ROLE.equals(user.getRole())) {
            throw new IllegalArgumentException("유효하지 않은 refresh 토큰입니다.");
        }
        String role = user.getRole() != null && !user.getRole().isBlank() ? user.getRole() : ADMIN_ROLE;
        String newAccess = jwtUtil.generateAccessToken(user.getId(), JwtUtil.SUBJECT_TYPE_ADMIN, user.getEmail(), role);
        String newRefresh = jwtUtil.generateRefreshToken(user.getId(), JwtUtil.SUBJECT_TYPE_ADMIN);
        saveRefreshToken(user.getId(), newRefresh);

        return TokenResponse.builder()
                .accessToken(newAccess)
                .refreshToken(newRefresh)
                .expiresIn(jwtUtil.getAccessExpirationMs() / 1000)
                .build();
    }

    private void saveRefreshToken(Long userId, String refreshTokenValue) {
        String hash = TokenHashUtil.hash(refreshTokenValue);
        Instant expiresAt = Instant.now().plusMillis(jwtUtil.getRefreshExpirationMs());
        RefreshToken rt = RefreshToken.builder()
                .tokenHash(hash)
                .expiresAt(expiresAt)
                .user(userRepository.getReferenceById(userId))
                .build();
        refreshTokenRepository.save(rt);
    }
}
