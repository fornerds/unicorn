package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminDashboardResponse {

    private long orderCount;
    private long userCount;
    private long revenue;
    private long recentOrders;
}
