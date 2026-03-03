package com.unicorn.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    private List<Long> cartItemIds;

    @NotNull
    @Valid
    private ShippingAddressDto shippingAddress;

    @NotNull
    private String paymentMethod;

    @Data
    public static class ShippingAddressDto {
        @NotEmpty
        private String recipient;
        @NotEmpty
        private String phone;
        @NotEmpty
        private String address;
        private String zipCode;
    }
}
