package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.news.NewsDetailResponse;
import com.unicorn.dto.news.NewsListResponse;
import com.unicorn.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "뉴스", description = "뉴스 목록·상세·인기글·태그 (공개된 뉴스만 노출)")
@RestController
@RequestMapping("/news")
@RequiredArgsConstructor
public class NewsController {

    private final NewsService newsService;

    @Operation(summary = "뉴스 목록 조회", description = "제목+내용 LIKE 검색, 태그 필터. 공개(published=true)만 노출")
    @GetMapping
    public ApiResponse<ListResponse<NewsListResponse>> getList(
            @Parameter(description = "제목·내용 검색어") @RequestParam(required = false) String keyword,
            @Parameter(description = "태그 ID 목록 (여러 개 시 OR)") @RequestParam(required = false) List<Long> tagIds,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<NewsListResponse> result = newsService.getList(keyword, tagIds, page, limit);
        PaginationDto pag = PaginationDto.builder()
                .page(result.getNumber() + 1)
                .limit(result.getSize())
                .total(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
        return ApiResponse.successList(result.getContent(), pag);
    }

    @Operation(summary = "뉴스 상세 조회", description = "조회수 증가, 관련 아티클 4개 포함. 공개된 뉴스만 조회 가능")
    @GetMapping("/{id}")
    public ApiResponse<NewsDetailResponse> getDetail(@PathVariable Long id) {
        return ApiResponse.success(newsService.getDetail(id));
    }

    @Operation(summary = "인기글 조회 (조회수 순)", description = "view_count 기준 상위 N건. 공개된 뉴스만")
    @GetMapping("/popular")
    public ApiResponse<List<NewsListResponse>> getPopularByViewCount(
            @Parameter(description = "건수 (기본 10, 최대 50)", example = "10") @RequestParam(required = false, defaultValue = "10") Integer limit) {
        return ApiResponse.success(newsService.getPopularByViewCount(limit));
    }

    @Operation(summary = "인기글 조회 (관리자 지정)", description = "관리자가 지정한 인기글. featured_order 순. 공개된 뉴스만")
    @GetMapping("/featured")
    public ApiResponse<List<NewsListResponse>> getFeatured(
            @Parameter(description = "건수 (기본 10, 최대 50)", example = "10") @RequestParam(required = false, defaultValue = "10") Integer limit) {
        return ApiResponse.success(newsService.getFeatured(limit));
    }
}
