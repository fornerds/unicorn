package com.unicorn.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 목록 API 응답용 래퍼. data 필드에 { items, pagination } 형태로 내려준다.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ListResponse<T> {

    private List<T> items;
    private PaginationDto pagination;

    public static <T> ListResponse<T> of(List<T> items, PaginationDto pagination) {
        return ListResponse.<T>builder()
                .items(items)
                .pagination(pagination)
                .build();
    }
}
