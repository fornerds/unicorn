package com.unicorn.dto.order;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CreateOrderResponse {

    private Long orderId;
    private BigDecimal totalAmount;
    /** 토스페이먼츠/페이팔 결제위젯 요청 시 사용할 주문 식별자 (6~64자). 예: order-123 */
    private String paymentOrderId;
    private String paymentRedirectUrl;
    private String paymentId;
}
