package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.admin.AdminInquiryDetailResponse;
import com.unicorn.dto.admin.AdminInquiryListResponse;
import com.unicorn.service.AdminInquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@Tag(name = "관리자 - 문의", description = "문의 목록·상세 조회")
@RestController
@RequestMapping("/admin/inquiries")
@RequiredArgsConstructor
public class AdminInquiryController {

    private final AdminInquiryService adminInquiryService;

    @Operation(summary = "문의 목록 조회")
    @GetMapping
    public ApiResponse<ListResponse<AdminInquiryListResponse>> getInquiries(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<AdminInquiryListResponse> result = adminInquiryService.getInquiries(page, limit);
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
}
