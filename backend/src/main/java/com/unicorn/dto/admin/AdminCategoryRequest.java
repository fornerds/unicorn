package com.unicorn.dto.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class AdminCategoryRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String slug;

    private UUID parentId;

    @NotNull
    private Integer sortOrder;
}
