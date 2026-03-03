package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.admin.AdminSettingsPatchRequest;
import com.unicorn.dto.admin.AdminSettingsResponse;
import com.unicorn.service.AdminSettingsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "관리자 - 설정", description = "관리자 앱 설정 조회·수정")
@RestController
@RequestMapping("/admin/settings")
@RequiredArgsConstructor
public class AdminSettingsController {

    private final AdminSettingsService adminSettingsService;

    @GetMapping
    public ApiResponse<AdminSettingsResponse> getSettings() {
        return ApiResponse.success(adminSettingsService.getSettings());
    }

    @Operation(summary = "설정 수정")
    @PatchMapping
    public ApiResponse<Map<String, List<String>>> updateSettings(@RequestBody AdminSettingsPatchRequest request) {
        List<String> updated = adminSettingsService.updateSettings(request);
        return ApiResponse.success(Map.of("updated", updated));
    }
}
