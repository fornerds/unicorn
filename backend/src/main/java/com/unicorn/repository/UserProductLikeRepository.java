package com.unicorn.repository;

import com.unicorn.entity.UserProductLike;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
public interface UserProductLikeRepository extends JpaRepository<UserProductLike, Long> {

    Optional<UserProductLike> findByUserIdAndProductId(Long userId, Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    Page<UserProductLike> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByProductId(Long productId);
}
