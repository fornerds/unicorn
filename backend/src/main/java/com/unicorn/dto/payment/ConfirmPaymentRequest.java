package com.unicorn.dto.payment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class ConfirmPaymentRequest {

    @NotNull
    private UUID orderId;

    @NotBlank
    private String paymentProvider;

    private String paymentKey;
    private String payerId;
    private String transactionId;
}
