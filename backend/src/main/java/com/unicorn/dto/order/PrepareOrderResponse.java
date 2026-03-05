package com.unicorn.dto.order;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class PrepareOrderResponse {

    private BigDecimal totalAmount;
    /** 결제창 요청 시 사용할 주문 식별자 (토스 등). 결제 성공 후 confirm-and-create-order 시 전달 */
    private String paymentOrderId;
    private String paymentMethod;
}
