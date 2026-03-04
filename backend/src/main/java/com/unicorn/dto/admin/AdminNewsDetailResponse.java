package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class AdminNewsDetailResponse {

    private Long id;
    private String title;
    private String content;
    private String imageUrl;
    private Boolean published;
    private Instant publishedAt;
    private Integer viewCount;
    private Boolean isFeatured;
    private Integer featuredOrder;
    private Instant createdAt;
    private Instant updatedAt;
    private List<AdminTagResponse> tags;
}
