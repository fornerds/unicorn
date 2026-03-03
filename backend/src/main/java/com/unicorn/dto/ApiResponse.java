package com.unicorn.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private int code;
    private T data;
    private String message;
    private PaginationDto pagination;

    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .code(200)
                .data(data)
                .message(null)
                .build();
    }

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .code(200)
                .data(data)
                .message(message)
                .build();
    }

    public static <T> ApiResponse<T> created(T data) {
        return ApiResponse.<T>builder()
                .code(201)
                .data(data)
                .message(null)
                .build();
    }

    public static <T> ApiResponse<T> noContent() {
        return ApiResponse.<T>builder()
                .code(204)
                .data(null)
                .message(null)
                .build();
    }

    public static <T> ApiResponse<T> successWithPagination(T data, PaginationDto pagination) {
        return ApiResponse.<T>builder()
                .code(200)
                .data(data)
                .message(null)
                .pagination(pagination)
                .build();
    }

    /**
     * 목록 응답: data에 ListResponse(items + pagination)를 넣고, 루트 pagination은 null.
     */
    public static <T> ApiResponse<ListResponse<T>> successList(List<T> items, PaginationDto pagination) {
        return ApiResponse.<ListResponse<T>>builder()
                .code(200)
                .data(ListResponse.of(items, pagination))
                .message(null)
                .pagination(null)
                .build();
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return ApiResponse.<T>builder()
                .code(code)
                .data(null)
                .message(message)
                .build();
    }
}
