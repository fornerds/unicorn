package com.unicorn.repository;

import com.unicorn.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<CartItem> findByUserIdAndProductIdAndColor(Long userId, Long productId, String color);
}
