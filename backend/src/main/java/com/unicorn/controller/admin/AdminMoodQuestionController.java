package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.admin.AdminMoodQuestionRequest;
import com.unicorn.dto.ai.MoodQuestionResponse;
import com.unicorn.service.AdminMoodQuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "관리자 - AI 기분질문", description = "관리자 기분 질문 CRUD")
@RestController
@RequestMapping("/admin/ai/mood-questions")
@RequiredArgsConstructor
public class AdminMoodQuestionController {

    private final AdminMoodQuestionService adminMoodQuestionService;

    @Operation(summary = "기분 질문 목록 조회")
    @GetMapping
    public ApiResponse<ListResponse<MoodQuestionResponse>> getMoodQuestions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        List<MoodQuestionResponse> data = adminMoodQuestionService.getMoodQuestions(page, limit);
        long total = adminMoodQuestionService.count();
        int totalPages = limit > 0 ? (int) Math.ceil((double) total / limit) : 0;
        PaginationDto pag = PaginationDto.builder().page(page).limit(limit).total(total).totalPages(totalPages).build();
        return ApiResponse.successList(data, pag);
    }

    @Operation(summary = "기분 질문 생성")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MoodQuestionResponse> create(@Valid @RequestBody AdminMoodQuestionRequest request) {
        return ApiResponse.created(adminMoodQuestionService.create(request));
    }

    @Operation(summary = "기분 질문 수정")
    @PatchMapping("/{id}")
    public ApiResponse<MoodQuestionResponse> update(@PathVariable UUID id, @Valid @RequestBody AdminMoodQuestionRequest request) {
        return ApiResponse.success(adminMoodQuestionService.update(id, request));
    }

    @Operation(summary = "기분 질문 삭제")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        adminMoodQuestionService.delete(id);
        return ApiResponse.noContent();
    }
}
