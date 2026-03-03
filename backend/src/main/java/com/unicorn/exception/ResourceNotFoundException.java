package com.unicorn.exception;

/**
 * 요청한 리소스가 존재하지 않을 때 사용.
 * GlobalExceptionHandler에서 404와 ApiResponse.error(404, message)로 변환한다.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
