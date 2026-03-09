package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.order.CreateOrderRequest;
import com.unicorn.dto.order.OrderDetailResponse;
import com.unicorn.dto.order.CreateOrderResponse;
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

    @Operation(summary = "주문 생성 (결제 전)", description = "장바구니나 상품에서 주문을 생성하고 pending 상태로 둡니다. 반환된 orderId로 결제를 진행합니다.")
    @PostMapping
    @ResponseStatus(org.springframework.http.HttpStatus.CREATED)
    public ApiResponse<CreateOrderResponse> createOrder(
            @AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request) {
        CreateOrderResponse data = orderService.createOrder(principal.subjectId(), request);
        return ApiResponse.created(data);
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
