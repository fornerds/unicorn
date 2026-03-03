package com.unicorn.controller.admin;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.admin.TestEmailRequest;
import com.unicorn.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "관리자 - 테스트", description = "개발/테스트용 유틸 (이메일 발송 테스트 등)")
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminTestController {

    private final EmailService emailService;

    @Operation(summary = "테스트 메일 발송", description = "지정한 주소로 테스트 메일 1통 발송. 메일 설정 검증용.")
    @PostMapping("/test-email")
    public ApiResponse<Void> sendTestEmail(@Valid @RequestBody TestEmailRequest request) {
        emailService.sendTestEmail(request.getEmail());
        return ApiResponse.success(null, "테스트 메일을 발송했습니다.");
    }
}
