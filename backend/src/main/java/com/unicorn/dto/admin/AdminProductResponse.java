package com.unicorn.dto.admin;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
@Data
@Builder
public class AdminProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private Integer stock;
    private Long categoryId;
    private List<String> images;
    private Instant createdAt;
    private Instant updatedAt;
}
