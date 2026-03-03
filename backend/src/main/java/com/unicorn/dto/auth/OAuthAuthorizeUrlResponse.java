package com.unicorn.dto.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OAuthAuthorizeUrlResponse {

    private String url;
    private String state;
}
