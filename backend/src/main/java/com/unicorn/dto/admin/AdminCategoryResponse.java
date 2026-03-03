package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class AdminCategoryResponse {

    private UUID id;
    private String name;
    private String slug;
    private UUID parentId;
    private Integer sortOrder;
    private Instant createdAt;
    private List<AdminCategoryResponse> children;
}
