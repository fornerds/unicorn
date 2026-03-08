package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class AdminInquiryDetailResponse {

    private Long id;
    private String name;
    private String phone;
    private String email;
    private String company;
    private Long productId;
    private String productName;
    private String inquiryType;
    private String content;
    private String status;
    private Instant repliedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
