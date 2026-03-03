package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.admin.AdminCategoryRequest;
import com.unicorn.dto.admin.AdminCategoryResponse;
import com.unicorn.service.AdminCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@Tag(name = "관리자 - 카테고리", description = "관리자 카테고리 CRUD")
@RestController
@RequestMapping("/admin/categories")
@RequiredArgsConstructor
public class AdminCategoryController {

    private final AdminCategoryService adminCategoryService;

    @Operation(summary = "카테고리 목록 조회")
    @GetMapping
    public ApiResponse<List<AdminCategoryResponse>> getCategories(@RequestParam(required = false) Long parentId) {
        return ApiResponse.success(adminCategoryService.getCategories(parentId));
    }

    @Operation(summary = "카테고리 생성")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminCategoryResponse> create(@Valid @RequestBody AdminCategoryRequest request) {
        return ApiResponse.created(adminCategoryService.create(request));
    }

    @Operation(summary = "카테고리 수정")
    @PatchMapping("/{id}")
    public ApiResponse<AdminCategoryResponse> update(@PathVariable Long id, @Valid @RequestBody AdminCategoryRequest request) {
        return ApiResponse.success(adminCategoryService.update(id, request));
    }

    @Operation(summary = "카테고리 삭제")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminCategoryService.delete(id);
        return ApiResponse.noContent();
    }
}
