package com.unicorn.service;

import com.unicorn.dto.product.ProductDetailResponse;
import com.unicorn.dto.product.ProductListResponse;
import com.unicorn.entity.Product;
import java.util.List;
import com.unicorn.repository.ProductColorStockRepository;
import com.unicorn.repository.ProductRepository;
import com.unicorn.repository.UserProductLikeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserProductLikeRepository userProductLikeRepository;
    private final ProductColorStockRepository productColorStockRepository;

    private static final java.util.Set<String> ALLOWED_SORT_FIELDS = java.util.Set.of("id", "name", "price", "stock", "createdAt", "updatedAt");
    private static final String DEFAULT_SORT = "createdAt";

    @Transactional(readOnly = true)
    public Page<ProductListResponse> getProducts(Long categoryId, String keyword, String sort, String order, int page, int limit, Long userId) {
        String sortField = sort != null && ALLOWED_SORT_FIELDS.contains(sort) ? sort : DEFAULT_SORT;
        boolean descending = "desc".equalsIgnoreCase(order);
        Sort s = descending ? Sort.by(sortField).descending() : Sort.by(sortField).ascending();
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)), s);
        Page<Product> pageResult = productRepository.findByCategoryAndKeyword(categoryId, keyword, pageable);
        return pageResult.map(p -> toListResponse(p, userId));
    }

    @Transactional(readOnly = true)
    public ProductDetailResponse getProduct(Long id, Long userId) {
        Product p = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다."));
        boolean isLiked = userId != null && userProductLikeRepository.existsByUserIdAndProductId(userId, p.getId());
        var cat = p.getCategory();
        var parent = cat.getParent();
        ProductDetailResponse.CategoryInfo parentInfo = parent != null
                ? ProductDetailResponse.CategoryInfo.builder()
                        .id(parent.getId())
                        .name(parent.getName())
                        .slug(parent.getSlug())
                        .build()
                : null;
        ProductDetailResponse.CategoryInfo categoryInfo = ProductDetailResponse.CategoryInfo.builder()
                .id(cat.getId())
                .name(cat.getName())
                .slug(cat.getSlug())
                .build();
        ProductDetailResponse.ProductDetail detail = buildProductDetail(p);
        var colorStocks = buildColorStocks(p);
        return ProductDetailResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .imageUrl(p.getImageUrl())
                .images(p.getImages())
                .parentCategory(parentInfo)
                .category(categoryInfo)
                .isLiked(isLiked)
                .colors(p.getColors())
                .colorStocks(colorStocks)
                .price(p.getPrice())
                .detail(detail)
                .shortDescription(p.getShortDescription())
                .content(p.getContent())
                .build();
    }

    private List<ProductDetailResponse.ColorStock> buildColorStocks(Product p) {
        var rows = productColorStockRepository.findByProductIdOrderByColor(p.getId());
        if (!rows.isEmpty()) {
            return rows.stream()
                    .map(cs -> ProductDetailResponse.ColorStock.builder()
                            .color(cs.getColor())
                            .stock(cs.getStock())
                            .build())
                    .toList();
        }
        return List.of(ProductDetailResponse.ColorStock.builder()
                .color(null)
                .stock(p.getStock())
                .build());
    }

    private static ProductDetailResponse.ProductDetail buildProductDetail(Product p) {
        return ProductDetailResponse.ProductDetail.builder()
                .weight(p.getWeight())
                .totalHeight(p.getTotalHeight())
                .operatingTime(p.getOperatingTime())
                .battery(p.getBattery())
                .speed(p.getSpeed())
                .build();
    }

    private ProductListResponse toListResponse(Product p, Long userId) {
        boolean isLiked = userId != null && userProductLikeRepository.existsByUserIdAndProductId(userId, p.getId());
        var cat = p.getCategory();
        var parent = cat.getParent();
        return ProductListResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .isLiked(isLiked)
                .parentCategory(parent != null ? ProductListResponse.CategorySummary.builder()
                        .id(parent.getId())
                        .name(parent.getName())
                        .build() : null)
                .category(ProductListResponse.CategorySummary.builder()
                        .id(cat.getId())
                        .name(cat.getName())
                        .build())
                .build();
    }
}
