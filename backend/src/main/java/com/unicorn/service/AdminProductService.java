package com.unicorn.service;

import com.unicorn.dto.admin.AdminColorStockItem;
import com.unicorn.dto.admin.AdminProductPatchRequest;
import com.unicorn.dto.admin.AdminProductRequest;
import com.unicorn.dto.admin.AdminProductResponse;
import com.unicorn.entity.Category;
import com.unicorn.entity.Product;
import com.unicorn.entity.ProductColorStock;
import com.unicorn.repository.CategoryRepository;
import com.unicorn.repository.ProductColorStockRepository;
import com.unicorn.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductColorStockRepository productColorStockRepository;

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
        String imageUrl = request.getImageUrl() != null && !request.getImageUrl().isBlank()
                ? request.getImageUrl()
                : (request.getImages() != null && !request.getImages().isEmpty() ? request.getImages().get(0) : null);
        Product p = Product.builder()
                .category(category)
                .name(request.getName())
                .price(request.getPrice())
                .imageUrl(imageUrl)
                .images(request.getImages())
                .stock(request.getStock())
                .weight(request.getWeight())
                .totalHeight(request.getTotalHeight())
                .operatingTime(request.getOperatingTime())
                .battery(request.getBattery())
                .speed(request.getSpeed())
                .shortDescription(request.getShortDescription())
                .content(request.getContent())
                .build();
        p = productRepository.save(p);
        syncColorStocks(p, request.getColorStocks());
        p = productRepository.save(p);
        return toResponse(p);
    }

    @Transactional
    public AdminProductResponse update(Long id, AdminProductPatchRequest request) {
        Product p = productRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("제품을 찾을 수 없습니다."));
        if (request.getName() != null) p.setName(request.getName());
        if (request.getPrice() != null) p.setPrice(request.getPrice());
        if (request.getStock() != null) p.setStock(request.getStock());
        if (request.getImageUrl() != null) {
            p.setImageUrl(request.getImageUrl().isBlank() ? null : request.getImageUrl());
        }
        if (request.getImages() != null) {
            p.setImages(request.getImages());
        }
        if (request.getWeight() != null) p.setWeight(request.getWeight());
        if (request.getTotalHeight() != null) p.setTotalHeight(request.getTotalHeight());
        if (request.getOperatingTime() != null) p.setOperatingTime(request.getOperatingTime());
        if (request.getBattery() != null) p.setBattery(request.getBattery());
        if (request.getSpeed() != null) p.setSpeed(request.getSpeed());
        if (request.getShortDescription() != null) p.setShortDescription(request.getShortDescription());
        if (request.getContent() != null) p.setContent(request.getContent());
        if (request.getColorStocks() != null) syncColorStocks(p, request.getColorStocks());

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

    private void syncColorStocks(Product p, List<AdminColorStockItem> colorStocks) {
        productColorStockRepository.deleteByProduct_Id(p.getId());
        productColorStockRepository.flush();
        if (colorStocks == null || colorStocks.isEmpty()) {
            return;
        }
        for (AdminColorStockItem item : colorStocks) {
            if (item.getColor() == null || item.getColor().isBlank()) continue;
            ProductColorStock cs = ProductColorStock.builder()
                    .product(p)
                    .color(item.getColor().trim())
                    .colorCode(item.getColorCode() != null && !item.getColorCode().isBlank() ? item.getColorCode().trim() : null)
                    .stock(item.getStock() != null && item.getStock() >= 0 ? item.getStock() : 0)
                    .build();
            productColorStockRepository.save(cs);
        }
    }

    private AdminProductResponse toResponse(Product p) {
        var cat = p.getCategory();
        var parent = cat.getParent();
        List<AdminColorStockItem> colorStocks = productColorStockRepository.findByProductIdOrderByColor(p.getId())
                .stream()
                .map(cs -> AdminColorStockItem.builder()
                        .color(cs.getColor())
                        .colorCode(cs.getColorCode())
                        .stock(cs.getStock())
                        .build())
                .collect(Collectors.toList());
        return AdminProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .stock(p.getStock())
                .colorStocks(colorStocks.isEmpty() ? null : colorStocks)
                .categoryId(cat.getId())
                .categoryName(cat.getName())
                .parentCategoryId(parent != null ? parent.getId() : null)
                .parentCategoryName(parent != null ? parent.getName() : null)
                .images(p.getImages())
                .weight(p.getWeight())
                .totalHeight(p.getTotalHeight())
                .operatingTime(p.getOperatingTime())
                .battery(p.getBattery())
                .speed(p.getSpeed())
                .shortDescription(p.getShortDescription())
                .content(p.getContent())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
