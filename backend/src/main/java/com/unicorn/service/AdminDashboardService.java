package com.unicorn.service;

import com.unicorn.dto.admin.AdminDashboardResponse;
import com.unicorn.repository.OrderRepository;
import com.unicorn.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {
        long orderCount = orderRepository.count();
        long userCount = userRepository.count();
        BigDecimal revenue = orderRepository.sumPaidAmount();
        int recentCount = orderRepository.findByAdminFilters(null, null, null, PageRequest.of(0, 10)).getNumberOfElements();
        return AdminDashboardResponse.builder()
                .orderCount(orderCount)
                .userCount(userCount)
                .revenue(revenue != null ? revenue.longValue() : 0L)
                .recentOrders(recentCount)
                .build();
    }
}
