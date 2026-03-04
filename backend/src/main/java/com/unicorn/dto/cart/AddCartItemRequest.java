package com.unicorn.dto.cart;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddCartItemRequest {

    @NotNull
    private Long productId;

    @Size(max = 100)
    private String color;

    @Positive
    private int quantity = 1;
}
