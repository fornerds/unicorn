package com.unicorn.dto.news;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.ALWAYS)
public class TagResponse {

    private Long id;
    private String name;
}
