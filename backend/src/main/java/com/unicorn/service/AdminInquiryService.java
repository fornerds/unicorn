package com.unicorn.service;

import com.unicorn.dto.admin.AdminInquiryDetailResponse;
import com.unicorn.dto.admin.AdminInquiryListResponse;
import com.unicorn.entity.Inquiry;
import com.unicorn.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminInquiryService {

    private final InquiryRepository inquiryRepository;

    @Transactional(readOnly = true)
    public Page<AdminInquiryListResponse> getInquiries(int page, int limit) {
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)));
        return inquiryRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public AdminInquiryDetailResponse getInquiry(Long id) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("문의를 찾을 수 없습니다."));
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
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .build();
    }
}
