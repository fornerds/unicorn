package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.address.AddressSearchResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "주소", description = "주소 검색(외부 API 연동 예정)")
@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
public class AddressController {

    @Operation(summary = "주소 검색")
    @GetMapping("/search")
    public ApiResponse<List<AddressSearchResponse>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        return ApiResponse.successWithPagination(List.of(), PaginationDto.builder().page(page).limit(limit).total(0L).totalPages(0).build());
    }
}
