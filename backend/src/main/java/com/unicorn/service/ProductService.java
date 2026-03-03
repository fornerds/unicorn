package com.unicorn.service;

import com.unicorn.dto.product.ProductDetailResponse;
import com.unicorn.dto.product.ProductListResponse;
import com.unicorn.entity.Product;
import com.unicorn.repository.ProductRepository;
import com.unicorn.repository.UserProductLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserProductLikeRepository userProductLikeRepository;

    @Transactional(readOnly = true)
    public Page<ProductListResponse> getProducts(Long categoryId, String keyword, String sort, String order, int page, int limit, Long userId) {
        Sort s = "desc".equalsIgnoreCase(order) ? Sort.by(sort).descending() : Sort.by(sort).ascending();
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)), s);
        Page<Product> pageResult = productRepository.findByCategoryAndKeyword(categoryId, keyword, pageable);
        return pageResult.map(p -> toListResponse(p, userId));
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProduct(Long id, Long userId) {
        Product p = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다."));
        long likesCount = userProductLikeRepository.countByProductId(p.getId());
        boolean isLiked = userId != null && userProductLikeRepository.existsByUserIdAndProductId(userId, p.getId());
        return ProductDetailResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .stock(p.getStock())
                .likesCount(likesCount)
                .isLiked(isLiked)
                .category(ProductDetailResponse.CategoryInfo.builder()
                        .id(p.getCategory().getId())
                        .name(p.getCategory().getName())
                        .build())
                .images(p.getImages())
                .build();
    }

    private ProductListResponse toListResponse(Product p, Long userId) {
        long likesCount = userProductLikeRepository.countByProductId(p.getId());
        boolean isLiked = userId != null && userProductLikeRepository.existsByUserIdAndProductId(userId, p.getId());
        return ProductListResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .stock(p.getStock())
                .likesCount(likesCount)
                .isLiked(isLiked)
                .categoryId(p.getCategory().getId())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
