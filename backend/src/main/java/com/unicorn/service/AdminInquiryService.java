package com.unicorn.service;

import com.unicorn.dto.admin.AdminInquiryDetailResponse;
import com.unicorn.dto.admin.AdminInquiryListResponse;
import com.unicorn.dto.admin.AdminInquiryPatchRequest;
import com.unicorn.dto.admin.AdminInquirySendReplyRequest;
import com.unicorn.entity.Inquiry;
import com.unicorn.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AdminInquiryService {

    private final InquiryRepository inquiryRepository;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public Page<AdminInquiryListResponse> getInquiries(String inquiryType, String status, int page, int limit) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)), sort);
        boolean hasFilter = StringUtils.hasText(inquiryType) || StringUtils.hasText(status);
        Page<Inquiry> result = hasFilter
                ? inquiryRepository.findByInquiryTypeAndStatus(inquiryType, status, pageable)
                : inquiryRepository.findAllByOrderByCreatedAtDesc(pageable);
        return result.map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public AdminInquiryDetailResponse getInquiry(Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));
        return toDetailResponse(inquiry);
    }

    @Transactional
    public AdminInquiryDetailResponse updateStatus(Long id, AdminInquiryPatchRequest request) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));
        if (StringUtils.hasText(request.getStatus())) {
            inquiry.setStatus(request.getStatus());
            if ("answered".equals(request.getStatus()) && inquiry.getRepliedAt() == null) {
                inquiry.setRepliedAt(Instant.now());
            }
        }
        inquiryRepository.save(inquiry);
        return toDetailResponse(inquiry);
    }

    /**
     * 1차 답변을 문의자 이메일로 발송하고 상태를 answered로 변경. 답변 내용은 DB에 저장하지 않음.
     */
    @Transactional
    public AdminInquiryDetailResponse sendReply(Long id, AdminInquirySendReplyRequest request) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));
        emailService.sendInquiryReply(
                inquiry.getEmail(),
                inquiry.getName(),
                inquiry.getContent(),
                request.getMessage()
        );
        inquiry.setStatus("answered");
        inquiry.setRepliedAt(Instant.now());
        inquiryRepository.save(inquiry);
        return toDetailResponse(inquiry);
    }

    private AdminInquiryListResponse toListResponse(Inquiry i) {
        String productName = i.getProduct() != null ? i.getProduct().getName() : null;
        return AdminInquiryListResponse.builder()
                .id(i.getId())
                .name(i.getName())
                .email(i.getEmail())
                .company(i.getCompany())
                .inquiryType(i.getInquiryType())
                .productId(i.getProduct() != null ? i.getProduct().getId() : null)
                .productName(productName)
                .status(i.getStatus())
                .repliedAt(i.getRepliedAt())
                .createdAt(i.getCreatedAt())
                .build();
    }

    private AdminInquiryDetailResponse toDetailResponse(Inquiry i) {
        String productName = i.getProduct() != null ? i.getProduct().getName() : null;
        return AdminInquiryDetailResponse.builder()
                .id(i.getId())
                .name(i.getName())
                .phone(i.getPhone())
                .email(i.getEmail())
                .company(i.getCompany())
                .productId(i.getProduct() != null ? i.getProduct().getId() : null)
                .productName(productName)
                .inquiryType(i.getInquiryType())
                .content(i.getContent())
                .status(i.getStatus())
                .repliedAt(i.getRepliedAt())
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .build();
    }
}
