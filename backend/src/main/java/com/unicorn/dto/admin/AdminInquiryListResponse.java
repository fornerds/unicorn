package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class AdminInquiryListResponse {

    private Long id;
    private String name;
    private String email;
    private String company;
    private String inquiryType;
    private Long productId;
    private String productName;
    private Instant createdAt;
}
