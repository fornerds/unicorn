package com.unicorn.dto.payment;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
public class ConfirmPaymentResponse {

    private UUID orderId;
    private String status;
    private Instant paidAt;
}
