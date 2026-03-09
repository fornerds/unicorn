package com.unicorn.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    @NotEmpty(message = "주문할 항목이 없습니다.")
    @Valid
    private List<OrderItemRequest> items;

    @NotNull
    @Valid
    private ShippingAddressDto shippingAddress;

    @NotNull
    private String paymentMethod;

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long productId;

        private String color;

        @NotNull
        @Min(1)
        private Integer quantity;
    }

    @Data
    public static class ShippingAddressDto {
        @NotEmpty
        private String recipient;
        @NotEmpty
        private String phone;
        @NotEmpty
        private String address;
        private String zipCode;
        private String deliveryRequest;
    }
}
