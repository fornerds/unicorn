package com.unicorn.client;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;
import java.util.Map;

/**
 * PayPal REST API 직접 연동 (토스 경유 없음).
 * - OAuth2 client_credentials 로 액세스 토큰 발급
 * - 주문 생성 POST /v2/checkout/orders
 * - 주문 캡처 POST /v2/checkout/orders/{id}/capture
 *
 * @see <a href="https://developer.paypal.com/docs/api/orders/v2/">Orders API v2</a>
 * @see <a href="https://developer.paypal.com/reference/get-an-access-token/">Get an access token</a>
 */
@Component
@RequiredArgsConstructor
public class PayPalClient {

    private static final String SANDBOX_BASE = "https://api-m.sandbox.paypal.com";
    private static final String LIVE_BASE = "https://api.paypal.com";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.payment.paypal.client-id:}")
    private String clientId;

    @Value("${app.payment.paypal.client-secret:}")
    private String clientSecret;

    @Value("${app.payment.paypal.sandbox:true}")
    private boolean sandbox;

    private String baseUrl() {
        return sandbox ? SANDBOX_BASE : LIVE_BASE;
    }

    private String getAccessToken() {
        if (clientId == null || clientId.isBlank() || clientSecret == null || clientSecret.isBlank()) {
            throw new IllegalStateException("PayPal client-id 또는 client-secret이 설정되지 않았습니다.");
        }
        String auth = "Basic " + Base64.getEncoder().encodeToString((clientId + ":" + clientSecret).getBytes(StandardCharsets.UTF_8));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", auth);
        HttpEntity<String> entity = new HttpEntity<>("grant_type=client_credentials", headers);
        ResponseEntity<PayPalTokenResponse> res = restTemplate.exchange(
                baseUrl() + "/v1/oauth2/token",
                HttpMethod.POST,
                entity,
                PayPalTokenResponse.class);
        if (res.getBody() == null || res.getBody().getAccessToken() == null) {
            throw new IllegalStateException("PayPal 액세스 토큰 발급 실패");
        }
        return res.getBody().getAccessToken();
    }

    /**
     * PayPal 주문 생성 (intent=CAPTURE). 결제 승인 전 클라이언트에서 호출.
     *
     * @param amountUsd   결제 금액 (USD, 소수점 2자리)
     * @param referenceId 참조 ID (우리 주문 ID 또는 "temp-xxx")
     * @return PayPal order ID
     */
    public String createOrder(String amountUsd, String referenceId) {
        String token = getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        String ref = referenceId != null ? referenceId : "temp";
        Map<String, Object> body = Map.of(
                "intent", "CAPTURE",
                "purchase_units", List.of(
                        Map.of(
                                "reference_id", "our-order-" + ref,
                                "amount", Map.of(
                                        "currency_code", "USD",
                                        "value", amountUsd
                                ),
                                "description", "Order " + ref
                        )
                )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<PayPalCreateOrderResponse> res = restTemplate.exchange(
                baseUrl() + "/v2/checkout/orders",
                HttpMethod.POST,
                entity,
                PayPalCreateOrderResponse.class);
        if (res.getBody() == null || res.getBody().getId() == null) {
            throw new IllegalStateException("PayPal 주문 생성 실패");
        }
        return res.getBody().getId();
    }

    /**
     * 구매자 승인 후 서버에서 캡처. paymentKey = PayPal order ID.
     */
    public void captureOrder(String paypalOrderId) {
        if (paypalOrderId == null || paypalOrderId.isBlank()) {
            throw new IllegalArgumentException("PayPal order ID가 필요합니다.");
        }
        String token = getAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        try {
            restTemplate.exchange(
                    baseUrl() + "/v2/checkout/orders/" + paypalOrderId + "/capture",
                    HttpMethod.POST,
                    entity,
                    Map.class);
        } catch (HttpClientErrorException e) {
            throw new IllegalArgumentException("PayPal 캡처 실패: " + (e.getResponseBodyAsString() != null ? e.getResponseBodyAsString() : e.getMessage()));
        }
    }

    public boolean isConfigured() {
        return clientId != null && !clientId.isBlank() && clientSecret != null && !clientSecret.isBlank();
    }

    public String getClientId() {
        return clientId != null ? clientId : "";
    }

    @Data
    private static class PayPalTokenResponse {
        @JsonProperty("access_token")
        private String accessToken;
        @JsonProperty("expires_in")
        private Integer expiresIn;
    }

    @Data
    private static class PayPalCreateOrderResponse {
        private String id;
        private String status;
    }
}
