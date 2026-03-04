package com.unicorn.dto.news;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class NewsRelatedItemResponse {

    private Long id;
    private String imageUrl;
    private String title;
    private String content;
    private Instant createdAt;
}
