package com.unicorn.dto.news;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class NewsListResponse {

    private Long id;
    private String imageUrl;
    private String title;
    private String content;
    private Instant createdAt;
}
