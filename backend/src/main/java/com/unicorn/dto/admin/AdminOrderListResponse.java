package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
@Data
@Builder
public class AdminOrderListResponse {

    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private String status;
    private Instant createdAt;
}
