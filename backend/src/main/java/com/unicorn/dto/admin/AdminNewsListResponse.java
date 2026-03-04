package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class AdminNewsListResponse {

    private Long id;
    private String title;
    private String imageUrl;
    private Boolean published;
    private Integer viewCount;
    private Boolean isFeatured;
    private Integer featuredOrder;
    private Instant createdAt;
    private List<AdminTagResponse> tags;
}
