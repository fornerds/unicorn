package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminSettingsResponse {

    private String siteName;
    private String paymentProvider;
    private boolean domesticPgEnabled;
}
