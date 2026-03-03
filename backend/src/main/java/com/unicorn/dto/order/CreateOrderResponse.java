package com.unicorn.dto.order;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class CreateOrderResponse {

    private UUID orderId;
    private BigDecimal totalAmount;
    private String paymentRedirectUrl;
    private String paymentId;
}
