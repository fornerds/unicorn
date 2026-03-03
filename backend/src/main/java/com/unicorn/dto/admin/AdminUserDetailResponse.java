package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
@Data
@Builder
public class AdminUserDetailResponse {

    private Long id;
    private String email;
    private String name;
    private String avatar;
    private String phone;
    private String status;
    private String memo;
    private Instant createdAt;
    private Instant updatedAt;
}
