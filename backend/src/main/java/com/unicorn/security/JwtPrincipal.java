package com.unicorn.security;

public record JwtPrincipal(Long subjectId, String subjectType, String role) {

    public boolean isAdmin() {
        return "ADMIN".equals(subjectType) || "ROLE_ADMIN".equals(role);
    }
}
