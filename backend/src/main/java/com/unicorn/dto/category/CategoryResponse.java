package com.unicorn.dto.category;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryResponse {

    private UUID id;
    private String name;
    private String slug;
    private String imageUrl;
    private Integer sortOrder;
    @Builder.Default
    private List<CategoryResponse> children = List.of();
}
