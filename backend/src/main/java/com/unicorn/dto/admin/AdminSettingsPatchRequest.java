package com.unicorn.dto.admin;

import lombok.Data;

@Data
public class AdminSettingsPatchRequest {

    private String siteName;
    private String paymentProvider;
}
