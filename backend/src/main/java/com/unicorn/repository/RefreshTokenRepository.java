package com.unicorn.repository;

import com.unicorn.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    Optional<RefreshToken> findByTokenHashAndExpiresAtAfter(String tokenHash, Instant now);

    void deleteByUser_Id(UUID userId);

    void deleteByTokenHash(String tokenHash);
}
