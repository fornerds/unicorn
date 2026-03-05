package com.unicorn.dto.payment;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PayPalCreateOrderResponse {

    private String paypalOrderId;
    /** KRW로 요청 시 환율 적용된 USD 금액 */
    private BigDecimal amountUsd;
}
