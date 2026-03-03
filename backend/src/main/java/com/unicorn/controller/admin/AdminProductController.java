package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.admin.AdminProductPatchRequest;
import com.unicorn.dto.admin.AdminProductRequest;
import com.unicorn.dto.admin.AdminProductResponse;
import com.unicorn.service.AdminProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Tag(name = "관리자 - 제품", description = "관리자 제품 목록·상세·생성·수정·삭제")
@RestController
@RequestMapping("/admin/products")
@RequiredArgsConstructor
public class AdminProductController {

    private final AdminProductService adminProductService;

    @Operation(summary = "제품 목록 조회")
    @GetMapping
    public ApiResponse<ListResponse<AdminProductResponse>> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<AdminProductResponse> result = adminProductService.getProducts(categoryId, keyword, page, limit);
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
    public ApiResponse<AdminProductResponse> getProduct(@PathVariable Long id) {
        return ApiResponse.success(adminProductService.getProduct(id));
    }

    @Operation(summary = "제품 생성")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminProductResponse> create(@Valid @RequestBody AdminProductRequest request) {
        return ApiResponse.created(adminProductService.create(request));
    }

    @Operation(summary = "제품 수정")
    @PatchMapping("/{id}")
    public ApiResponse<AdminProductResponse> update(@PathVariable Long id, @Valid @RequestBody AdminProductPatchRequest request) {
        return ApiResponse.success(adminProductService.update(id, request));
    }

    @Operation(summary = "제품 삭제")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminProductService.delete(id);
        return ApiResponse.noContent();
    }
}
