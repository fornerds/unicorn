package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.order.CreateOrderRequest;
import com.unicorn.dto.order.CreateOrderResponse;
import com.unicorn.dto.order.OrderDetailResponse;
import com.unicorn.dto.order.OrderListResponse;
import com.unicorn.security.JwtPrincipal;
import com.unicorn.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "주문", description = "장바구니 기반 주문 생성, 주문 상세 조회")
@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @Operation(summary = "장바구니에서 주문 생성")
    @PostMapping("/from-cart")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CreateOrderResponse> createFromCart(
            @AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request) {
        CreateOrderResponse data = orderService.createFromCart(principal.subjectId(), request);
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
