package com.unicorn.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class CreateOrderRequest {

    private List<UUID> cartItemIds;

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
