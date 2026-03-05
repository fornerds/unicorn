package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.order.CreateOrderRequest;
import com.unicorn.dto.order.OrderDetailResponse;
import com.unicorn.dto.order.PrepareOrderResponse;
import com.unicorn.security.JwtPrincipal;
import com.unicorn.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "주문", description = "장바구니 기반 주문 생성, 주문 상세 조회")
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "결제 준비 (주문 미생성)", description = "장바구니 기준 금액·결제용 orderId만 반환. 결제 성공 시 POST /payments/confirm-and-create-order 호출.")
    @PostMapping("/prepare")
    public ApiResponse<PrepareOrderResponse> prepareOrder(
            @AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request) {
        PrepareOrderResponse data = orderService.prepareOrder(principal.subjectId(), request);
        return ApiResponse.success(data);
    }

    @Operation(summary = "주문 상세 조회")
    @GetMapping("/{id}")
    public ApiResponse<OrderDetailResponse> getOrder(
            @AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable Long id) {
        OrderDetailResponse data = orderService.getOrder(principal.subjectId(), id);
        return ApiResponse.success(data);
    }

}
