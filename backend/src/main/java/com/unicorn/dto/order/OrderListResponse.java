package com.unicorn.dto.order;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
@Data
@Builder
public class OrderListResponse {

    private Long id;
    private List<OrderDetailResponse.OrderItemDto> items;
    private BigDecimal totalAmount;
    private String status;
    private Instant createdAt;
    private Instant updatedAt;
}
