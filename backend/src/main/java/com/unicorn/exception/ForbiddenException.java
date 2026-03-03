package com.unicorn.exception;

/**
 * 인증은 되어 있으나 해당 리소스에 대한 권한이 없을 때 사용.
 * GlobalExceptionHandler에서 403과 ApiResponse.error(403, message)로 변환한다.
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException(String message, Throwable cause) {
        super(message, cause);
    }
}
