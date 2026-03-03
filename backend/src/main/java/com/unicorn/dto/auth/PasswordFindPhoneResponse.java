package com.unicorn.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PasswordFindPhoneResponse {

    private Boolean sent;
    private Boolean success;
}
