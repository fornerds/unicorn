package com.unicorn.repository;

import com.unicorn.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHashAndExpiresAtAfter(String tokenHash, Instant now);

    void deleteByUser_Id(Long userId);

    void deleteByTokenHash(String tokenHash);
}
