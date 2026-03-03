package com.unicorn.dto.upload;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UploadResponse {

    private String url;
}
