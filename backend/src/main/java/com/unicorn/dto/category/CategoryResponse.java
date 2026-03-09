package com.unicorn.dto.category;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CategoryResponse {

    private Long id;
    private String name;
    private String slug;
    private String imageUrl;
    private Integer sortOrder;
    @Builder.Default
    private List<CategoryResponse> children = List.of();
}
