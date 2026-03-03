package com.unicorn.dto.category;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CategoryResponse {

    private Long id;
    private String name;
    private String slug;
    private String imageUrl;
    private Integer sortOrder;
    @Builder.Default
    private List<CategoryResponse> children = List.of();
}
