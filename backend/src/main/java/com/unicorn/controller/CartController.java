package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.cart.AddCartItemRequest;
import com.unicorn.dto.cart.CartResponse;
import com.unicorn.dto.cart.UpdateCartItemRequest;
import com.unicorn.security.JwtPrincipal;
import com.unicorn.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "장바구니", description = "장바구니 조회·담기·수량 수정·삭제")
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @Operation(summary = "장바구니 조회")
    @GetMapping
    public ApiResponse<CartResponse> getCart(@AuthenticationPrincipal JwtPrincipal principal) {
        CartResponse data = cartService.getCart(principal.subjectId());
        return ApiResponse.success(data);
    }

    @Operation(summary = "장바구니 담기")
    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CartResponse.CartItemDto> addItem(
            @AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody AddCartItemRequest request) {
        CartResponse.CartItemDto data = cartService.addItem(principal.subjectId(), request);
        return ApiResponse.created(data);
    }

    @Operation(summary = "장바구니 수량 수정")
    @PatchMapping("/items/{id}")
    public ApiResponse<CartResponse.CartItemDto> updateItem(
            @AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartResponse.CartItemDto data = cartService.updateItem(principal.subjectId(), id, request);
        return ApiResponse.success(data);
    }

    @Operation(summary = "장바구니 항목 삭제")
    @DeleteMapping("/items/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> deleteItem(
            @AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable Long id) {
        cartService.deleteItem(principal.subjectId(), id);
        return ApiResponse.noContent();
    }
}
