package com.unicorn.security;

import java.util.UUID;

public record JwtPrincipal(UUID subjectId, String subjectType, String role) {

    public boolean isAdmin() {
        return "ADMIN".equals(subjectType) || "ROLE_ADMIN".equals(role);
    }
}
