package com.unicorn.dto.admin;

import lombok.Data;

import jakarta.validation.constraints.Size;

@Data
public class AdminUpdateUserRequest {

    @Size(max = 20)
    private String status;

    @Size(max = 1000)
    private String memo;
}
