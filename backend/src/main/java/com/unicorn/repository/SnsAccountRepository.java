package com.unicorn.repository;

import com.unicorn.entity.SnsAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface SnsAccountRepository extends JpaRepository<SnsAccount, Long> {

    Optional<SnsAccount> findByProviderAndProviderUserId(String provider, String providerUserId);
}
