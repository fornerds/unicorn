package com.unicorn.dto.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConfirmPaymentRequest {

    @NotNull
    private Long orderId;

    @NotBlank
    private String paymentProvider;

    private String paymentKey;
    private String payerId;
    private String transactionId;
}
