package com.unicorn.dto.user;

import lombok.Data;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Data
public class UpdateUserMeRequest {

    @Size(max = 100)
    private String name;

    @Size(max = 20)
    private String phone;
    
    @Email
    private String email;

    private Boolean marketingAgreed;
}
