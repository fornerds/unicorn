package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.payment.ConfirmPaymentRequest;
import com.unicorn.dto.payment.ConfirmPaymentResponse;
import com.unicorn.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "결제", description = "결제 확인(토스페이먼츠 등)")
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "결제 확인")
    @PostMapping("/confirm")
    public ApiResponse<ConfirmPaymentResponse> confirm(@Valid @RequestBody ConfirmPaymentRequest request) {
        ConfirmPaymentResponse data = paymentService.confirm(request);
        return ApiResponse.success(data);
    }
}
