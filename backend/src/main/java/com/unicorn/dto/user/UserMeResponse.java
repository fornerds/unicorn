package com.unicorn.dto.user;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserMeResponse {

    private Long id;
    private String email;
    private String name;
    private String avatar;
    private String phone;
    private Instant createdAt;
    private Instant updatedAt;
}
