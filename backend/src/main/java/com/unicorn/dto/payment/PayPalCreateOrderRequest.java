package com.unicorn.dto.payment;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PayPalCreateOrderRequest {

    @NotNull(message = "주문 ID가 필요합니다.")
    private Long orderId;
}
