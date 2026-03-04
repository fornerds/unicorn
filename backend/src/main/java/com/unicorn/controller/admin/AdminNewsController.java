package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.admin.AdminNewsDetailResponse;
import com.unicorn.dto.admin.AdminNewsListResponse;
import com.unicorn.dto.admin.AdminNewsRequest;
import com.unicorn.service.AdminNewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "관리자 - 뉴스", description = "관리자 뉴스 CRUD, 인기글 지정 (임시)")
@RestController
@RequestMapping("/admin/news")
@RequiredArgsConstructor
public class AdminNewsController {

    private final AdminNewsService adminNewsService;

    @Operation(summary = "뉴스 목록 조회", description = "전체(공개/비공개) 목록, 키워드 검색")
    @GetMapping
    public ApiResponse<ListResponse<AdminNewsListResponse>> getList(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<AdminNewsListResponse> result = adminNewsService.getList(keyword, page, limit);
        PaginationDto pag = PaginationDto.builder()
                .page(result.getNumber() + 1)
                .limit(result.getSize())
                .total(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
        return ApiResponse.successList(result.getContent(), pag);
    }

    @Operation(summary = "뉴스 상세 조회")
    @GetMapping("/{id}")
    public ApiResponse<AdminNewsDetailResponse> getDetail(@PathVariable Long id) {
        return ApiResponse.success(adminNewsService.getDetail(id));
    }

    @Operation(summary = "뉴스 생성", description = "태그 ID 목록, 공개 여부, 인기글 지정 포함")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<AdminNewsDetailResponse> create(@Valid @RequestBody AdminNewsRequest request) {
        return ApiResponse.created(adminNewsService.create(request));
    }

    @Operation(summary = "뉴스 수정", description = "인기글 지정(isFeatured, featuredOrder) 포함")
    @PatchMapping("/{id}")
    public ApiResponse<AdminNewsDetailResponse> update(@PathVariable Long id, @Valid @RequestBody AdminNewsRequest request) {
        return ApiResponse.success(adminNewsService.update(id, request));
    }

    @Operation(summary = "뉴스 삭제")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> delete(@PathVariable Long id) {
        adminNewsService.delete(id);
        return ApiResponse.noContent();
    }
}
