package com.unicorn.service;

import com.unicorn.dto.like.LikeToggleResponse;
import com.unicorn.dto.product.ProductListResponse;
import com.unicorn.entity.Product;
import com.unicorn.entity.UserProductLike;
import com.unicorn.repository.ProductRepository;
import com.unicorn.repository.UserProductLikeRepository;
import com.unicorn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserLikeService {

    private final UserProductLikeRepository userProductLikeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Page<ProductListResponse> getLikes(Long userId, int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)));
        Page<UserProductLike> likes = userProductLikeRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        return likes.map(like -> {
            Product p = like.getProduct();
            long count = userProductLikeRepository.countByProductId(p.getId());
            return ProductListResponse.builder()
                    .id(p.getId())
                    .name(p.getName())
                    .description(p.getDescription())
                    .price(p.getPrice())
                    .imageUrl(p.getImageUrl())
                    .stock(p.getStock())
                    .likesCount(count)
                    .isLiked(true)
                    .createdAt(p.getCreatedAt())
                    .updatedAt(p.getUpdatedAt())
                    .build();
        });
    }

    @Transactional
    public LikeToggleResponse toggleLike(Long userId, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다."));
        var existing = userProductLikeRepository.findByUserIdAndProductId(userId, productId);
        boolean isLiked;
        if (existing.isPresent()) {
            userProductLikeRepository.delete(existing.get());
            isLiked = false;
        } else {
            UserProductLike like = UserProductLike.builder()
                    .user(userRepository.getReferenceById(userId))
                    .product(product)
                    .build();
            userProductLikeRepository.save(like);
            isLiked = true;
        }
        long count = userProductLikeRepository.countByProductId(productId);
        return LikeToggleResponse.builder().isLiked(isLiked).likesCount(count).build();
    }
}
