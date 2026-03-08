package com.unicorn.dto.admin;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AdminInquiryPatchRequest {

    @Pattern(regexp = "pending|answered", message = "status는 pending 또는 answered만 가능합니다.")
    private String status;
}
