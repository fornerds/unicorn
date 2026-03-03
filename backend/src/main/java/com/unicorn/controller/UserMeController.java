package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.product.ProductListResponse;
import com.unicorn.dto.like.LikeToggleResponse;
import com.unicorn.dto.user.UpdatePasswordRequest;
import com.unicorn.dto.user.UpdateUserMeRequest;
import com.unicorn.dto.order.OrderListResponse;
import com.unicorn.dto.user.UserMeResponse;
import com.unicorn.security.JwtPrincipal;
import com.unicorn.service.OrderService;
import com.unicorn.service.UserLikeService;
import com.unicorn.service.UserMeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "사용자 - 프로필/찜/주문", description = "내 정보 조회·수정, 찜 목록, 내 주문 목록")
@RestController
@RequestMapping("/users/me")
@RequiredArgsConstructor
public class UserMeController {

    private final UserLikeService userLikeService;
    private final UserMeService userMeService;
    private final OrderService orderService;

    @Operation(summary = "찜 목록 조회")
    @GetMapping("/likes")
    public ApiResponse<ListResponse<ProductListResponse>> getLikes(
            @AuthenticationPrincipal JwtPrincipal principal,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<ProductListResponse> result = userLikeService.getLikes(principal.subjectId(), page, limit);
        PaginationDto pag = PaginationDto.builder()
                .page(result.getNumber() + 1)
                .limit(result.getSize())
                .total(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
        return ApiResponse.successList(result.getContent(), pag);
    }

    @Operation(summary = "찜 추가/취소 토글")
    @PostMapping("/likes/{productId}")
    public ApiResponse<LikeToggleResponse> toggleLike(
            @AuthenticationPrincipal JwtPrincipal principal,
            @PathVariable UUID productId) {
        LikeToggleResponse data = userLikeService.toggleLike(principal.subjectId(), productId);
        return ApiResponse.success(data);
    }

    @Operation(summary = "내 주문 목록 조회")
    @GetMapping("/orders")
    public ApiResponse<ListResponse<OrderListResponse>> getMyOrders(
            @AuthenticationPrincipal JwtPrincipal principal,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<OrderListResponse> result = orderService.getMyOrders(principal.subjectId(), status, page, limit);
        PaginationDto pag = PaginationDto.builder()
                .page(result.getNumber() + 1)
                .limit(result.getSize())
                .total(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
        return ApiResponse.successList(result.getContent(), pag);
    }

    @Operation(summary = "내 정보 조회")
    @GetMapping
    public ApiResponse<UserMeResponse> getMe(@AuthenticationPrincipal JwtPrincipal principal) {
        UserMeResponse data = userMeService.getMe(principal.subjectId());
        return ApiResponse.success(data);
    }

    @Operation(summary = "내 정보 수정")
    @PatchMapping
    public ApiResponse<UserMeResponse> updateMe(
            @AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody UpdateUserMeRequest request) {
        UserMeResponse data = userMeService.updateMe(principal.subjectId(), request);
        return ApiResponse.success(data);
    }

    @Operation(summary = "비밀번호 변경")
    @PatchMapping("/password")
    public ApiResponse<Map<String, Boolean>> updatePassword(
            @AuthenticationPrincipal JwtPrincipal principal,
            @Valid @RequestBody UpdatePasswordRequest request) {
        userMeService.updatePassword(principal.subjectId(), request);
        return ApiResponse.success(Map.of("success", true));
    }
}
