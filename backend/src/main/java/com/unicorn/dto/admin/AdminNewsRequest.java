package com.unicorn.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class AdminNewsRequest {

    @NotBlank(message = "제목은 필수입니다.")
    private String title;

    private String content;
    private String imageUrl;
    private Boolean published;
    private Instant publishedAt;
    private List<Long> tagIds;
    private Boolean isFeatured;
    private Integer featuredOrder;
}
