package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.news.TagResponse;
import com.unicorn.service.NewsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "태그", description = "뉴스 태그 목록 (뉴스 필터용)")
@RestController
@RequestMapping("/tags")
@RequiredArgsConstructor
public class TagController {

    private final NewsService newsService;

    @Operation(summary = "태그 목록 조회")
    @GetMapping
    public ApiResponse<List<TagResponse>> getTags() {
        List<TagResponse> data = newsService.getTags();
        return ApiResponse.success(data);
    }
}
