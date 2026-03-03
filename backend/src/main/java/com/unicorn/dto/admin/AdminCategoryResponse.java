package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;
@Data
@Builder
public class AdminCategoryResponse {

    private Long id;
    private String name;
    private String slug;
    private Long parentId;
    private Integer sortOrder;
    private Instant createdAt;
    private List<AdminCategoryResponse> children;
}
