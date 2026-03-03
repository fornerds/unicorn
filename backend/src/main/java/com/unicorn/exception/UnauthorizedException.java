package com.unicorn.exception;

/**
 * 인증이 필요하거나 토큰이 유효하지 않을 때 사용.
 * GlobalExceptionHandler에서 401과 ApiResponse.error(401, message)로 변환한다.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException(String message, Throwable cause) {
        super(message, cause);
    }
}
