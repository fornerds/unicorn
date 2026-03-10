package com.unicorn.service;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

/**
 * KRW ↔ USD 환율 조회. 설정값 우선, 없으면 외부 API(open.er-api.com) 사용 후 캐시.
 */
@Service
public class ExchangeRateService {

    private static final String DEFAULT_API_URL = "https://open.er-api.com/v6/latest/USD";
    private static final long CACHE_TTL_MS = 60 * 60 * 1000L; // 1시간

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.payment.exchange-rate.krw-per-usd:0}")
    private BigDecimal configKrwPerUsd;

    @Value("${app.payment.exchange-rate.api-url:" + DEFAULT_API_URL + "}")
    private String apiUrl;

    private final AtomicReference<BigDecimal> cachedKrwPerUsd = new AtomicReference<>(null);
    private volatile long cacheExpiresAt = 0L;

    /**
     * 1 USD = ? KRW (예: 1300)
     */
    public BigDecimal getKrwPerUsd() {
        if (configKrwPerUsd != null && configKrwPerUsd.compareTo(BigDecimal.ZERO) > 0) {
            return configKrwPerUsd;
        }
        if (System.currentTimeMillis() < cacheExpiresAt && cachedKrwPerUsd.get() != null) {
            return cachedKrwPerUsd.get();
        }
        try {
            ResponseEntity<ErApiResponse> res = restTemplate.getForEntity(apiUrl, ErApiResponse.class);
            if (res.getBody() != null && res.getBody().getRates() != null) {
                Number krw = res.getBody().getRates().get("KRW");
                if (krw != null) {
                    BigDecimal rate = BigDecimal.valueOf(krw.doubleValue()).setScale(4, RoundingMode.HALF_UP);
                    cachedKrwPerUsd.set(rate);
                    cacheExpiresAt = System.currentTimeMillis() + CACHE_TTL_MS;
                    return rate;
                }
            }
        } catch (Exception ignored) {
        }
        return cachedKrwPerUsd.get() != null ? cachedKrwPerUsd.get() : BigDecimal.valueOf(1300);
    }

    /**
     * KRW 금액을 USD로 변환 (소수점 2자리)
     */
    public BigDecimal krwToUsd(BigDecimal amountKrw) {
        if (amountKrw == null || amountKrw.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal krwPerUsd = getKrwPerUsd();
        return amountKrw.divide(krwPerUsd, 2, RoundingMode.HALF_UP);
    }

    /**
     * USD 금액을 KRW로 변환 (정수 반올림). API 응답·주문 금액 등 프론트에 원화로 보낼 때 사용.
     */
    public BigDecimal usdToKrw(BigDecimal amountUsd) {
        if (amountUsd == null || amountUsd.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal krwPerUsd = getKrwPerUsd();
        return amountUsd.multiply(krwPerUsd).setScale(0, RoundingMode.HALF_UP);
    }

    /**
     * DB 저장 단위(currency)에 따라 원화 금액 반환. USD 또는 null/blank면 환율 적용, KRW면 그대로(정수).
     */
    public BigDecimal priceToKrw(BigDecimal price, String currency) {
        if (price == null) return BigDecimal.ZERO;
        if (currency == null || currency.isBlank() || "USD".equalsIgnoreCase(currency)) {
            return usdToKrw(price);
        }
        return price.setScale(0, RoundingMode.HALF_UP);
    }

    /**
     * DB 저장 단위(currency)에 따라 달러 금액 반환. KRW면 환율 적용, USD면 그대로(소수점 2자리).
     */
    public BigDecimal priceToUsd(BigDecimal price, String currency) {
        if (price == null) return BigDecimal.ZERO;
        if ("KRW".equalsIgnoreCase(currency)) {
            return krwToUsd(price);
        }
        return price.setScale(2, RoundingMode.HALF_UP);
    }

    @Data
    private static class ErApiResponse {
        private Map<String, Number> rates;
    }
}
