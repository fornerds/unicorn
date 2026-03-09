package com.unicorn.dto.payment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConfirmPaymentRequest {

    @NotNull
    private Long orderId;

    @NotNull
    private String paymentProvider;

    @NotNull
    private String paymentKey;

    @NotNull
    private Long amount;
}
