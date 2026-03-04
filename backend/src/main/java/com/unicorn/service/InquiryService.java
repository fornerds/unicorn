package com.unicorn.service;

import com.unicorn.dto.inquiry.InquiryCreateRequest;
import com.unicorn.dto.inquiry.InquiryCreateResponse;
import com.unicorn.entity.Inquiry;
import com.unicorn.entity.Product;
import com.unicorn.repository.InquiryRepository;
import com.unicorn.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final ProductRepository productRepository;

    @Transactional
    public InquiryCreateResponse create(InquiryCreateRequest request) {
        Product product = null;
        if (request.getProductId() != null) {
            product = productRepository.findById(request.getProductId()).orElse(null);
        }
        Inquiry inquiry = Inquiry.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .company(request.getCompany())
                .product(product)
                .inquiryType(request.getInquiryType())
                .content(request.getContent())
                .build();
        inquiry = inquiryRepository.save(inquiry);
        return InquiryCreateResponse.builder()
                .id(inquiry.getId())
                .createdAt(inquiry.getCreatedAt())
                .build();
    }
}
