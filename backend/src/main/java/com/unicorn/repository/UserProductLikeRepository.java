package com.unicorn.repository;

import com.unicorn.entity.UserProductLike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserProductLikeRepository extends JpaRepository<UserProductLike, UUID> {

    Optional<UserProductLike> findByUserIdAndProductId(UUID userId, UUID productId);

    boolean existsByUserIdAndProductId(UUID userId, UUID productId);

    Page<UserProductLike> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    long countByProductId(UUID productId);
}
