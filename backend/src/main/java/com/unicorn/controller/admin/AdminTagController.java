package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.admin.AdminTagRequest;
import com.unicorn.dto.admin.AdminTagResponse;
import com.unicorn.service.AdminTagService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "관리자 - 태그", description = "관리자 태그 CRUD (뉴스 태그)")
@RestController
@RequestMapping("/admin/tags")
@RequiredArgsConstructor
public class AdminTagController {

    private final AdminTagService adminTagService;

    @Operation(summary = "태그 목록 조회")
    @GetMapping
    public ApiResponse<List<AdminTagResponse>> getTags() {
        return ApiResponse.success(adminTagService.getTags());
    }

    @Operation(summary = "태그 생성")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminTagResponse> create(@Valid @RequestBody AdminTagRequest request) {
        return ApiResponse.created(adminTagService.create(request));
    }

    @Operation(summary = "태그 수정")
    @PatchMapping("/{id}")
    public ApiResponse<AdminTagResponse> update(@PathVariable Long id, @Valid @RequestBody AdminTagRequest request) {
        return ApiResponse.success(adminTagService.update(id, request));
    }

    @Operation(summary = "태그 삭제")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminTagService.delete(id);
        return ApiResponse.noContent();
    }
}
