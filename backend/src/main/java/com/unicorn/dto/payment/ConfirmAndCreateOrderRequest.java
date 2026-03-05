package com.unicorn.dto.payment;

import com.unicorn.dto.order.CreateOrderRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ConfirmAndCreateOrderRequest {

    @NotNull
    private String paymentProvider;

    @NotNull
    private String paymentKey;

    @NotNull
    private Long amount;

    /** 토스 결제 시 requestPayment에 사용한 orderId와 동일한 값 */
    private String tempOrderId;

    @NotNull
    @Valid
    private CreateOrderRequest.ShippingAddressDto shippingAddress;

    @NotNull
    private String paymentMethod;

    /** 주문에 포함할 장바구니 항목 ID. 비어있거나 null이면 장바구니 전체 사용 */
    private java.util.List<Long> cartItemIds;
}
