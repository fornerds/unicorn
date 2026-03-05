package com.unicorn.controller;

import com.unicorn.client.PayPalClient;
import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.payment.ConfirmAndCreateOrderRequest;
import com.unicorn.dto.payment.ConfirmPaymentResponse;
import com.unicorn.dto.payment.PaymentWidgetConfigResponse;
import com.unicorn.dto.payment.PayPalCreateOrderRequest;
import com.unicorn.dto.payment.PayPalCreateOrderResponse;
import com.unicorn.service.ExchangeRateService;
import com.unicorn.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@Tag(name = "결제", description = "토스(결제창)·PayPal(직접 연동) 결제")
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PayPalClient payPalClient;
    private final ExchangeRateService exchangeRateService;

    @Value("${app.payment.toss.client-key:}")
    private String tossClientKey;

    @Operation(summary = "토스 클라이언트 키 조회", description = "API 개별 연동 키(일반결제) 클라이언트 키. 결제창 연동 시 사용. 비로그인 허용.")
    @GetMapping("/toss-client-key")
    public ApiResponse<PaymentWidgetConfigResponse> getTossClientKey() {
        PaymentWidgetConfigResponse data = PaymentWidgetConfigResponse.builder()
                .tossClientKey(tossClientKey != null ? tossClientKey : "")
                .build();
        return ApiResponse.success(data);
    }

    @Operation(summary = "결제 위젯 설정 조회", description = "토스 클라이언트 키 반환. 결제창용은 /payments/toss-client-key 권장. 비로그인 허용.")
    @GetMapping("/widget-config")
    public ApiResponse<PaymentWidgetConfigResponse> getWidgetConfig() {
        return getTossClientKey();
    }

    @Operation(summary = "환율 조회", description = "1 USD = ? KRW. 비로그인 허용. PayPal 원화→달러 결제 시 참고.")
    @GetMapping("/exchange-rate")
    public ApiResponse<ExchangeRateResponse> getExchangeRate() {
        return ApiResponse.success(new ExchangeRateResponse(exchangeRateService.getKrwPerUsd()));
    }

    @Operation(summary = "PayPal 클라이언트 ID 조회", description = "프론트에서 PayPal JS SDK 로드 시 사용. 비로그인 허용.")
    @GetMapping("/paypal-client-id")
    public ApiResponse<PayPalClientIdResponse> getPayPalClientId() {
        String clientId = payPalClient.isConfigured() ? payPalClient.getClientId() : "";
        return ApiResponse.success(new PayPalClientIdResponse(clientId));
    }

    @Operation(summary = "PayPal 주문 생성", description = "PayPal 결제용 주문 생성. 로그인 필요. approve 후 POST /payments/confirm-and-create-order 호출.")
    @PostMapping("/paypal/create-order")
    public ApiResponse<PayPalCreateOrderResponse> createPayPalOrder(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.unicorn.security.JwtPrincipal principal,
            @Valid @RequestBody PayPalCreateOrderRequest request) {
        PayPalCreateOrderResponse data = paymentService.createPayPalOrder(principal.subjectId(), request);
        return ApiResponse.success(data);
    }

    @Operation(summary = "결제 성공 시 주문 생성 및 승인", description = "prepare 흐름: 결제 완료 후 호출. 주문 생성 + PG 승인 + 장바구니 삭제.")
    @PostMapping("/confirm-and-create-order")
    public ApiResponse<ConfirmPaymentResponse> confirmAndCreateOrder(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.unicorn.security.JwtPrincipal principal,
            @Valid @RequestBody ConfirmAndCreateOrderRequest request) {
        ConfirmPaymentResponse data = paymentService.confirmAndCreateOrder(principal.subjectId(), request);
        return ApiResponse.success(data);
    }

    @lombok.Data
    public static class PayPalClientIdResponse {
        private final String paypalClientId;
    }

    @lombok.Data
    public static class ExchangeRateResponse {
        private final java.math.BigDecimal krwPerUsd;
    }
}
