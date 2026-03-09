package com.unicorn.repository;

import com.unicorn.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findFirstByEmailAndPurposeOrderByCreatedAtDesc(String email, String purpose);
}
