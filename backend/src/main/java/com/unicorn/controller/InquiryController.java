package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.inquiry.InquiryCreateRequest;
import com.unicorn.dto.inquiry.InquiryCreateResponse;
import com.unicorn.service.InquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "문의", description = "문의하기 등록 (비로그인 가능)")
@RestController
@RequestMapping("/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;

    @Operation(summary = "문의 등록")
    @PostMapping
    public ApiResponse<InquiryCreateResponse> create(@Valid @RequestBody InquiryCreateRequest request) {
        InquiryCreateResponse data = inquiryService.create(request);
        return ApiResponse.created(data, "문의가 등록되었습니다.");
    }
}
