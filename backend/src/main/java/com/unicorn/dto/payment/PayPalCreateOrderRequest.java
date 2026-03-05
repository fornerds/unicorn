package com.unicorn.dto.payment;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PayPalCreateOrderRequest {

    /** prepare 흐름에서는 없음. 기존 주문 결제 시에만 사용 */
    private Long orderId;

    /** 결제 금액(USD). amountKrw가 있으면 무시하고 환율로 변환해 사용 */
    private BigDecimal amountUsd;

    /** 결제 금액(KRW). 있으면 현재 환율로 USD 변환 후 PayPal 주문 생성(해외/원화 기준 결제 시) */
    private java.math.BigDecimal amountKrw;
}
