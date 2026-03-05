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

/**
 * 토스페이먼츠 결제 승인 API 호출.
 * - 국내: 토스(카드/계좌이체 등) KRW
 * - 해외: 결제위젯 PayPal USD (동일 결제 승인 API 사용)
 *
 * @see <a href="https://docs.tosspayments.com/reference#%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8">결제 승인</a>
 * @see <a href="https://docs.tosspayments.com/guides/v2/payment-widget/integration-paypal">PayPal 연동하기</a>
 */
@Component
@RequiredArgsConstructor
public class TossPaymentsClient {

    private static final String CONFIRM_URL = "https://api.tosspayments.com/v1/payments/confirm";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.payment.toss.secret-key:}")
    private String secretKey;

    /**
     * 결제 승인. 시크릿 키 뒤에 ':' 붙여 Base64 인코딩 후 Basic 헤더로 전달.
     */
    public TossPaymentResponse confirm(String paymentKey, String orderId, Long amount) {
        if (secretKey == null || secretKey.isBlank()) {
            throw new IllegalStateException("토스페이먼츠 시크릿 키가 설정되지 않았습니다.");
        }
        String auth = "Basic " + Base64.getEncoder().encodeToString((secretKey + ":").getBytes(StandardCharsets.UTF_8));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", auth);

        TossConfirmRequest body = new TossConfirmRequest();
        body.setPaymentKey(paymentKey);
        body.setOrderId(orderId);
        body.setAmount(amount);

        HttpEntity<TossConfirmRequest> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<TossPaymentResponse> res = restTemplate.exchange(
                    CONFIRM_URL,
                    HttpMethod.POST,
                    entity,
                    TossPaymentResponse.class);
            return res.getBody();
        } catch (HttpClientErrorException e) {
            String msg = e.getResponseBodyAsString();
            throw new IllegalArgumentException("토스페이먼츠 결제 승인 실패: " + (msg != null && !msg.isEmpty() ? msg : e.getStatusCode().toString()));
        }
    }

    @Data
    public static class TossConfirmRequest {
        private String paymentKey;
        private String orderId;
        private Long amount;
    }

    @Data
    public static class TossPaymentResponse {
        private String paymentKey;
        private String orderId;
        private String status;
        private Long totalAmount;
        @JsonProperty("approvedAt")
        private String approvedAt;
    }
}
