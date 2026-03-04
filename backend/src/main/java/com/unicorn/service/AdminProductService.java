package com.unicorn.service;

import com.unicorn.dto.admin.AdminProductPatchRequest;
import com.unicorn.dto.admin.AdminProductRequest;
import com.unicorn.dto.admin.AdminProductResponse;
import com.unicorn.entity.Category;
import com.unicorn.entity.Product;
import com.unicorn.repository.CategoryRepository;
import com.unicorn.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public Page<AdminProductResponse> getProducts(Long categoryId, String keyword, int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)));
        return productRepository.findByCategoryAndKeyword(categoryId, keyword, pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public AdminProductResponse getProduct(Long id) {
        Product p = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다."));
        return toResponse(p);
    }

    @Transactional
    public AdminProductResponse create(AdminProductRequest request) {
        Category category = categoryRepository.getReferenceById(request.getCategoryId());
        String imageUrl = request.getImages() != null && !request.getImages().isEmpty() ? request.getImages().get(0) : null;
        Product p = Product.builder()
                .category(category)
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(imageUrl)
                .images(request.getImages())
                .stock(request.getStock())
                .build();
        p = productRepository.save(p);
        return toResponse(p);
    }

    @Transactional
    public AdminProductResponse update(Long id, AdminProductPatchRequest request) {
        Product p = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다."));
        if (request.getName() != null) p.setName(request.getName());
        if (request.getDescription() != null) p.setDescription(request.getDescription());
        if (request.getPrice() != null) p.setPrice(request.getPrice());
        if (request.getStock() != null) p.setStock(request.getStock());
        if (request.getImages() != null) p.setImages(request.getImages());
        if (request.getImages() != null && !request.getImages().isEmpty() && p.getImageUrl() == null) {
            p.setImageUrl(request.getImages().get(0));
        }
        p = productRepository.save(p);
        return toResponse(p);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("제품을 찾을 수 없습니다.");
        }
        productRepository.deleteById(id);
    }

    private AdminProductResponse toResponse(Product p) {
        var cat = p.getCategory();
        var parent = cat.getParent();
        return AdminProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .stock(p.getStock())
                .categoryId(cat.getId())
                .categoryName(cat.getName())
                .parentCategoryId(parent != null ? parent.getId() : null)
                .parentCategoryName(parent != null ? parent.getName() : null)
                .images(p.getImages())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
