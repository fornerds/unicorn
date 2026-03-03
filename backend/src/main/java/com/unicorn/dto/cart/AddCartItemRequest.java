package com.unicorn.dto.cart;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class AddCartItemRequest {

    @NotNull
    private Long productId;

    @Positive
    private int quantity = 1;
}
