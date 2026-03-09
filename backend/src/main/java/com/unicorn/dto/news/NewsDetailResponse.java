package com.unicorn.dto.news;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class NewsDetailResponse {

    private Long id;
    private String imageUrl;
    private String title;
    private String content;
    private Integer viewCount;
    private Instant publishedAt;
    private Instant createdAt;
    private List<TagResponse> tags;
    private List<NewsRelatedItemResponse> relatedArticles;
}
