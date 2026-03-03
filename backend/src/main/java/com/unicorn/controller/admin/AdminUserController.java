package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.ListResponse;
import com.unicorn.dto.PaginationDto;
import com.unicorn.dto.admin.AdminUpdateUserRequest;
import com.unicorn.dto.admin.AdminUserDetailResponse;
import com.unicorn.dto.admin.AdminUserListResponse;
import com.unicorn.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@Tag(name = "관리자 - 회원", description = "관리자 회원 목록·상세·수정·삭제")
@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public ApiResponse<ListResponse<AdminUserListResponse>> getUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {
        Page<AdminUserListResponse> result = adminUserService.getUsers(keyword, page, limit);
        PaginationDto pag = PaginationDto.builder()
                .page(result.getNumber() + 1)
                .limit(result.getSize())
                .total(result.getTotalElements())
                .totalPages(result.getTotalPages())
                .build();
        return ApiResponse.successList(result.getContent(), pag);
    }

    @Operation(summary = "회원 상세 조회")
    @GetMapping("/{id}")
    public ApiResponse<AdminUserDetailResponse> getUser(@PathVariable UUID id) {
        return ApiResponse.success(adminUserService.getUser(id));
    }

    @Operation(summary = "회원 수정")
    @PatchMapping("/{id}")
    public ApiResponse<AdminUserDetailResponse> updateUser(@PathVariable UUID id, @Valid @RequestBody AdminUpdateUserRequest request) {
        return ApiResponse.success(adminUserService.updateUser(id, request));
    }

    @Operation(summary = "회원 삭제")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ApiResponse<Void> deleteUser(@PathVariable UUID id) {
        adminUserService.deleteUser(id);
        return ApiResponse.noContent();
    }
}
