package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.ai.ChatRequest;
import com.unicorn.dto.ai.ChatResponse;
import com.unicorn.dto.ai.MoodQuestionResponse;
import com.unicorn.service.AiChatService;
import com.unicorn.service.MoodQuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "AI", description = "기분 질문 목록, AI 채팅")
@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiController {

    private final MoodQuestionService moodQuestionService;
    private final AiChatService aiChatService;

    @Operation(summary = "기분 질문 목록 조회")
    @GetMapping("/mood-questions")
    public ApiResponse<ListResponse<MoodQuestionResponse>> getMoodQuestions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        List<MoodQuestionResponse> data = moodQuestionService.getMoodQuestions(page, limit);
        long total = moodQuestionService.countMoodQuestions();
        int totalPages = limit > 0 ? (int) Math.ceil((double) total / limit) : 0;
        PaginationDto pag = PaginationDto.builder().page(page).limit(limit).total(total).totalPages(totalPages).build();
        return ApiResponse.successList(data, pag);
    }

    @Operation(summary = "AI 채팅")
    @PostMapping("/chat")
    public ApiResponse<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse data = aiChatService.chat(request.getMessage(), request.getConversationId());
        return ApiResponse.success(data);
    }
}
