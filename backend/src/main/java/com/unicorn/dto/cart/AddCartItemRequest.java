package com.unicorn.dto.cart;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.UUID;

@Data
public class AddCartItemRequest {

    @NotNull
    private UUID productId;

    @Positive
    private int quantity = 1;
}
