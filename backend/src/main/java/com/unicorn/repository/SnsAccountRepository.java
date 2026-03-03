package com.unicorn.repository;

import com.unicorn.entity.SnsAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SnsAccountRepository extends JpaRepository<SnsAccount, UUID> {

    Optional<SnsAccount> findByProviderAndProviderUserId(String provider, String providerUserId);
}
