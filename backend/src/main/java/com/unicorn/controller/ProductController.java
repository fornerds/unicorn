package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.product.ProductDetailResponse;
import com.unicorn.dto.product.ProductListResponse;
import com.unicorn.security.JwtPrincipal;
import com.unicorn.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "제품", description = "제품 목록·상세 조회 (카테고리·키워드·정렬·찜 여부)")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @Operation(summary = "제품 목록 조회")
    @GetMapping
    public ApiResponse<ListResponse<ProductListResponse>> getProducts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String order,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal JwtPrincipal principal) {
        UUID userId = principal != null ? principal.subjectId() : null;
        Page<ProductListResponse> result = productService.getProducts(categoryId, keyword, sort, order, page, limit, userId);
        PaginationDto pag = PaginationDto.builder()
                .page(result.getNumber() + 1)
                .limit(result.getSize())
                .total(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
        return ApiResponse.successList(result.getContent(), pag);
    }

    @Operation(summary = "제품 상세 조회")
    @GetMapping("/{id}")
    public ApiResponse<ProductDetailResponse> getProduct(@PathVariable UUID id, @AuthenticationPrincipal JwtPrincipal principal) {
        UUID userId = principal != null ? principal.subjectId() : null;
        ProductDetailResponse data = productService.getProduct(id, userId);
        return ApiResponse.success(data);
    }
}
