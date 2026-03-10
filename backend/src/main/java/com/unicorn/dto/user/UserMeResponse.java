package com.unicorn.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserMeResponse {

    private String email;
    private String name;
    private String phone;
    private Boolean marketingAgreed;
    private Boolean isSnsUser;
}
