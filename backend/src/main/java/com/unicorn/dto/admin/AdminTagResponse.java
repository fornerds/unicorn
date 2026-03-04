package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class AdminTagResponse {

    private Long id;
    private String name;
    private Instant createdAt;
}
