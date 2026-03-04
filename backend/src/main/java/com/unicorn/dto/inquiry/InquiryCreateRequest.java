package com.unicorn.dto.inquiry;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InquiryCreateRequest {

    @NotBlank(message = "이름을 입력해 주세요.")
    @Size(max = 100)
    private String name;

    @NotBlank(message = "연락처를 입력해 주세요.")
    @Size(max = 20)
    private String phone;

    @NotBlank(message = "이메일을 입력해 주세요.")
    @Email
    @Size(max = 255)
    private String email;

    @Size(max = 200)
    private String company;

    private Long productId;

    @NotBlank(message = "문의 유형을 선택해 주세요.")
    @Size(max = 50)
    private String inquiryType;

    @NotBlank(message = "문의 내용을 입력해 주세요.")
    private String content;
}
