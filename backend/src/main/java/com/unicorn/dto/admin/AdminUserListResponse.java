package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
@Data
@Builder
public class AdminUserListResponse {

    private Long id;
    private String email;
    private String name;
    private String phone;
    private String status;
    private Instant createdAt;
}
