package com.unicorn.service;

import com.unicorn.dto.admin.AdminSettingsPatchRequest;
import com.unicorn.dto.admin.AdminSettingsResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminSettingsService {

    @Value("${app.settings.site-name:Unicorn}")
    private String siteName;

    @Value("${app.settings.payment-provider:paypal}")
    private String paymentProvider;

    @Value("${app.settings.domestic-pg-enabled:true}")
    private boolean domesticPgEnabled;

    public AdminSettingsResponse getSettings() {
        return AdminSettingsResponse.builder()
                .siteName(siteName)
                .paymentProvider(paymentProvider)
                .domesticPgEnabled(domesticPgEnabled)
                .build();
    }

    public List<String> updateSettings(AdminSettingsPatchRequest request) {
        List<String> updated = new ArrayList<>();
        if (request.getSiteName() != null) {
            siteName = request.getSiteName();
            updated.add("siteName");
        }
        if (request.getPaymentProvider() != null) {
            paymentProvider = request.getPaymentProvider();
            updated.add("paymentProvider");
        }
        return updated;
    }
}
