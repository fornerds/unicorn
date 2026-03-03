package com.unicorn.service;

import com.unicorn.dto.admin.AdminOrderDetailResponse;
import com.unicorn.dto.admin.AdminOrderListResponse;
import com.unicorn.dto.admin.AdminOrderPatchRequest;
import com.unicorn.entity.Order;
import com.unicorn.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminOrderService {

    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public Page<AdminOrderListResponse> getOrders(String status, String startDate, String endDate, int page, int limit) {
        Instant start = parseDate(startDate, false);
        Instant end = endDate != null && !endDate.isBlank() ? parseDate(endDate, true) : null;
        Pageable pageable = PageRequest.of(Math.max(0, page - 1), Math.min(100, Math.max(1, limit)));
        Page<Order> orders = orderRepository.findByAdminFilters(status, start, end, pageable);
        return orders.map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public AdminOrderDetailResponse getOrder(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        return toDetailResponse(order);
    }

    @Transactional
    public AdminOrderDetailResponse updateOrder(Long id, AdminOrderPatchRequest request) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        if (request.getStatus() != null) order.setStatus(request.getStatus());
        order = orderRepository.save(order);
        return AdminOrderDetailResponse.builder()
                .id(order.getId())
                .status(order.getStatus())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private Instant parseDate(String dateStr, boolean endOfDay) {
        if (dateStr == null || dateStr.isBlank()) return null;
        LocalDate d = LocalDate.parse(dateStr);
        return endOfDay ? d.plus(1, ChronoUnit.DAYS).atStartOfDay(ZoneOffset.UTC).toInstant()
                : d.atStartOfDay(ZoneOffset.UTC).toInstant();
    }

    private AdminOrderListResponse toListResponse(Order o) {
        return AdminOrderListResponse.builder()
                .id(o.getId())
                .userId(o.getUser().getId())
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus())
                .createdAt(o.getCreatedAt())
                .build();
    }

    private AdminOrderDetailResponse toDetailResponse(Order o) {
        List<AdminOrderDetailResponse.OrderItemDto> items = o.getItems().stream()
                .map(oi -> AdminOrderDetailResponse.OrderItemDto.builder()
                        .productId(oi.getProduct().getId())
                        .quantity(oi.getQuantity())
                        .price(oi.getPrice())
                        .build())
                .collect(Collectors.toList());
        return AdminOrderDetailResponse.builder()
                .id(o.getId())
                .userId(o.getUser().getId())
                .items(items)
                .totalAmount(o.getTotalAmount())
                .status(o.getStatus())
                .shipping(AdminOrderDetailResponse.ShippingDto.builder()
                        .recipient(o.getRecipient())
                        .phone(o.getPhone())
                        .address(o.getAddress())
                        .zipCode(o.getZipCode())
                        .build())
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }
}
