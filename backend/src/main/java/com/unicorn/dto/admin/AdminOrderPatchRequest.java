package com.unicorn.dto.admin;

import lombok.Data;

import jakarta.validation.constraints.Size;

@Data
public class AdminOrderPatchRequest {

    @Size(max = 30)
    private String status;
}
