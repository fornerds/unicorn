package com.unicorn.util;

import com.unicorn.config.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    private static final String CLAIM_SUBJECT_TYPE = "subjectType";
    private static final String CLAIM_SUBJECT_ID = "subjectId";
    private static final String CLAIM_EMAIL = "email";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_TYPE = "type";
    private static final String TYPE_REFRESH = "refresh";

    public static final String SUBJECT_TYPE_USER = "USER";
    public static final String SUBJECT_TYPE_ADMIN = "ADMIN";

    private final JwtProperties jwtProperties;

    private SecretKey getAccessSigningKey() {
        byte[] keyBytes = jwtProperties.getAccessSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private SecretKey getRefreshSigningKey() {
        byte[] keyBytes = jwtProperties.getRefreshSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(Long subjectId, String subjectType, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(CLAIM_SUBJECT_TYPE, subjectType);
        claims.put(CLAIM_SUBJECT_ID, subjectId != null ? subjectId.toString() : null);
        claims.put(CLAIM_EMAIL, email != null ? email : "");
        claims.put(CLAIM_ROLE, role != null ? role : "USER");
        return buildToken(claims, jwtProperties.getAccessExpirationMs(), getAccessSigningKey());
    }

    public String generateRefreshToken(Long subjectId, String subjectType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(CLAIM_TYPE, TYPE_REFRESH);
        claims.put(CLAIM_SUBJECT_TYPE, subjectType);
        claims.put(CLAIM_SUBJECT_ID, subjectId != null ? subjectId.toString() : null);
        return buildToken(claims, jwtProperties.getRefreshExpirationMs(), getRefreshSigningKey());
    }

    private String buildToken(Map<String, Object> claims, long expirationMs, SecretKey key) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .claims(claims)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(key)
                .compact();
    }

    public boolean validateAccessToken(String token) {
        try {
            Claims claims = parseToken(token, getAccessSigningKey());
            return !claims.getExpiration().before(new Date()) && !TYPE_REFRESH.equals(claims.get(CLAIM_TYPE));
        } catch (Exception e) {
            return false;
        }
    }

    public boolean validateRefreshToken(String token) {
        try {
            Claims claims = parseToken(token, getRefreshSigningKey());
            return TYPE_REFRESH.equals(claims.get(CLAIM_TYPE)) && !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parseToken(String token, SecretKey key) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long extractSubjectId(String accessToken) {
        String id = extractClaim(accessToken, getAccessSigningKey(), claims -> (String) claims.get(CLAIM_SUBJECT_ID));
        return id != null ? Long.valueOf(id) : null;
    }

    public String extractSubjectType(String accessToken) {
        return extractClaim(accessToken, getAccessSigningKey(), claims -> (String) claims.get(CLAIM_SUBJECT_TYPE));
    }

    public String extractEmail(String accessToken) {
        return extractClaim(accessToken, getAccessSigningKey(), claims -> (String) claims.get(CLAIM_EMAIL));
    }

    public String extractRole(String accessToken) {
        return extractClaim(accessToken, getAccessSigningKey(), claims -> (String) claims.get(CLAIM_ROLE));
    }

    public Long extractSubjectIdFromRefresh(String refreshToken) {
        String id = extractClaim(refreshToken, getRefreshSigningKey(), claims -> (String) claims.get(CLAIM_SUBJECT_ID));
        return id != null ? Long.valueOf(id) : null;
    }

    public String extractSubjectTypeFromRefresh(String refreshToken) {
        return extractClaim(refreshToken, getRefreshSigningKey(), claims -> (String) claims.get(CLAIM_SUBJECT_TYPE));
    }

    private <T> T extractClaim(String token, SecretKey key, Function<Claims, T> resolver) {
        try {
            return resolver.apply(parseToken(token, key));
        } catch (Exception e) {
            return null;
        }
    }

    public long getAccessExpirationMs() {
        return jwtProperties.getAccessExpirationMs();
    }

    public long getRefreshExpirationMs() {
        return jwtProperties.getRefreshExpirationMs();
    }
}
