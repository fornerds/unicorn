package com.unicorn.security;

import com.unicorn.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);

        if (token != null && jwtUtil.validateAccessToken(token)) {
            try {
                Long subjectId = jwtUtil.extractSubjectId(token);
                String subjectType = jwtUtil.extractSubjectType(token);
                String role = jwtUtil.extractRole(token);
                if (subjectId != null && subjectType != null && role != null && !role.isBlank()) {
                    String authority = role.startsWith("ROLE_") ? role : "ROLE_" + role;
                    JwtPrincipal principal = new JwtPrincipal(subjectId, subjectType, role);
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    principal,
                                    null,
                                    List.of(new SimpleGrantedAuthority(authority))
                            );
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                log.debug("JWT authentication failed", e);
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * JWT 추출: Authorization Bearer 헤더만 사용. access_token 쿠키로는 인증 불가(리프레시만 쿠키 사용).
     */
    private String extractToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7).trim();
        }
        return null;
    }
}
