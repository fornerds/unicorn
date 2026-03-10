package com.unicorn.dto.admin;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Data
public class AdminUpdateUserRequest {

    @Email
    @Size(max = 255)
    private String email;

    @Size(max = 100)
    private String name;

    @Size(max = 20)
    private String phone;

    @Size(max = 20)
    private String status;

    @Size(max = 1000)
    private String memo;
}
