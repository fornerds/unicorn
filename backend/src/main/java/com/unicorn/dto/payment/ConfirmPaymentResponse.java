package com.unicorn.dto.payment;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ConfirmPaymentResponse {

    private Long orderId;
    private String status;
    private Instant paidAt;
}
