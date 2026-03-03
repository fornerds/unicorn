package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.category.CategoryResponse;
import com.unicorn.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "카테고리", description = "제품 카테고리 목록·계층 조회")
@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "카테고리 목록 조회", description = "parentId 미지정 시 최상위, 지정 시 하위 카테고리")
    @GetMapping
    public ApiResponse<List<CategoryResponse>> getCategories(@RequestParam(required = false) UUID parentId) {
        List<CategoryResponse> data = categoryService.getCategories(parentId);
        return ApiResponse.success(data);
    }
}
