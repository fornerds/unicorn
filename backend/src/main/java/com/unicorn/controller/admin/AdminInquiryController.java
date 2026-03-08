package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.admin.AdminInquiryDetailResponse;
import com.unicorn.dto.admin.AdminInquiryListResponse;
import com.unicorn.dto.admin.AdminInquiryPatchRequest;
import com.unicorn.dto.admin.AdminInquirySendReplyRequest;
import com.unicorn.service.AdminInquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@Tag(name = "관리자 - 문의", description = "문의 목록·상세·상태 수정·답변 메일 발송")
@RestController
@RequestMapping("/admin/inquiries")
@RequiredArgsConstructor
public class AdminInquiryController {

    private final AdminInquiryService adminInquiryService;

    @Operation(summary = "문의 목록 조회", description = "inquiryType, status로 필터 가능")
    @GetMapping
    public ApiResponse<ListResponse<AdminInquiryListResponse>> getInquiries(
            @RequestParam(required = false) String inquiryType,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<AdminInquiryListResponse> result = adminInquiryService.getInquiries(inquiryType, status, page, limit);
        PaginationDto pag = PaginationDto.builder()
                .page(result.getNumber() + 1)
                .limit(result.getSize())
                .total(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
        return ApiResponse.successList(result.getContent(), pag);
    }

    @Operation(summary = "문의 상세 조회")
    @GetMapping("/{id}")
    public ApiResponse<AdminInquiryDetailResponse> getInquiry(@PathVariable Long id) {
        return ApiResponse.success(adminInquiryService.getInquiry(id));
    }

    @Operation(summary = "문의 상태 수정", description = "status: pending(미답변), answered(답변 완료)")
    @PatchMapping("/{id}")
    public ApiResponse<AdminInquiryDetailResponse> updateInquiry(@PathVariable Long id, @Valid @RequestBody AdminInquiryPatchRequest request) {
        return ApiResponse.success(adminInquiryService.updateStatus(id, request));
    }

    @Operation(summary = "답변 메일 발송", description = "1차 답변을 문의자 이메일로 발송하고 상태를 answered로 변경. 답변 내용은 DB에 저장하지 않으며, 이후 대화는 메일에서 진행.")
    @PostMapping("/{id}/send-reply")
    public ApiResponse<AdminInquiryDetailResponse> sendReply(@PathVariable Long id, @Valid @RequestBody AdminInquirySendReplyRequest request) {
        return ApiResponse.success(adminInquiryService.sendReply(id, request));
    }
}
