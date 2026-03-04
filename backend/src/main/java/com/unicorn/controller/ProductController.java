package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.like.LikeToggleResponse;
import com.unicorn.dto.product.ProductDetailResponse;
import com.unicorn.dto.product.ProductListResponse;
import com.unicorn.security.JwtPrincipal;
import com.unicorn.service.ProductService;
import com.unicorn.service.UserLikeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "제품", description = "제품 목록·상세 조회, 찜 추가/취소 (카테고리·키워드·정렬·찜 여부)")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final UserLikeService userLikeService;

    @Operation(summary = "제품 목록 조회")
    @GetMapping
    public ApiResponse<ListResponse<ProductListResponse>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @Parameter(description = "정렬 기준. 가능 값: id, name, price, stock, createdAt, updatedAt", example = "createdAt")
            @RequestParam(defaultValue = "createdAt") String sort,
            @Parameter(description = "정렬 방향. 가능 값: asc(오름차순), desc(내림차순)", example = "desc")
            @RequestParam(defaultValue = "desc") String order,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal JwtPrincipal principal) {
        Long userId = principal != null ? principal.subjectId() : null;
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
    public ApiResponse<ProductDetailResponse> getProduct(@PathVariable Long id, @AuthenticationPrincipal JwtPrincipal principal) {
        Long userId = principal != null ? principal.subjectId() : null;
        ProductDetailResponse data = productService.getProduct(id, userId);
        return ApiResponse.success(data);
    }

    @Operation(summary = "찜 추가/취소 토글")
    @PostMapping("/{productId}/like")
    public ApiResponse<LikeToggleResponse> toggleLike(
            @AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable Long productId) {
        if (principal == null) {
            throw new com.unicorn.exception.UnauthorizedException("로그인이 필요합니다.");
        }
        LikeToggleResponse data = userLikeService.toggleLike(principal.subjectId(), productId);
        String message = data.isLiked() ? "찜 추가" : "찜 취소";
        return ApiResponse.success(data, message);
    }
}
