package com.unicorn.dto.payment;

import lombok.Builder;
import lombok.Data;

/**
 * 프론트에서 토스 결제위젯 SDK 초기화 시 사용할 공개 설정.
 * 시크릿 키는 포함하지 않음.
 */
@Data
@Builder
public class PaymentWidgetConfigResponse {

    private String tossClientKey;
}
