package com.unicorn.controller;

import com.unicorn.dto.ApiResponse;
import com.unicorn.dto.upload.UploadResponse;
import com.unicorn.service.S3UploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Tag(name = "업로드", description = "이미지 업로드(S3)")
@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
public class UploadController {

    private final S3UploadService s3UploadService;

    @Operation(summary = "이미지 업로드")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<UploadResponse> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        UploadResponse data = s3UploadService.uploadImage(file);
        return ApiResponse.success(data);
    }
}
