package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.admin.AdminOrderDetailResponse;
import com.unicorn.dto.admin.AdminOrderListResponse;
import com.unicorn.dto.admin.AdminOrderPatchRequest;
import com.unicorn.service.AdminOrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Tag(name = "관리자 - 주문", description = "관리자 주문 목록·상세·상태 수정")
@RestController
@RequestMapping("/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final AdminOrderService adminOrderService;

    @Operation(summary = "주문 목록 조회")
    @GetMapping
    public ApiResponse<ListResponse<AdminOrderListResponse>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<AdminOrderListResponse> result = adminOrderService.getOrders(status, startDate, endDate, page, limit);
        PaginationDto pag = PaginationDto.builder()
                .page(result.getNumber() + 1)
                .limit(result.getSize())
                .total(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
        return ApiResponse.successList(result.getContent(), pag);
    }

    @Operation(summary = "주문 상세 조회")
    @GetMapping("/{id}")
    public ApiResponse<AdminOrderDetailResponse> getOrder(@PathVariable UUID id) {
        return ApiResponse.success(adminOrderService.getOrder(id));
    }

    @Operation(summary = "주문 상태 수정")
    @PatchMapping("/{id}")
    public ApiResponse<AdminOrderDetailResponse> updateOrder(@PathVariable UUID id, @Valid @RequestBody AdminOrderPatchRequest request) {
        AdminOrderDetailResponse data = adminOrderService.updateOrder(id, request);
        return ApiResponse.success(data);
    }
}
