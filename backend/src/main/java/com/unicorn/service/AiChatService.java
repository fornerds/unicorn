package com.unicorn.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unicorn.dto.ai.ChatResponse;
import com.unicorn.dto.ai.ProductCatalogItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiChatService {

    private static final String OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
    /** 채팅 카탈로그용 요약 최대 길이. 제품 수가 많을수록 프롬프트 비용·토큰 절감을 위해 짧게 유지 */
    private static final int PRODUCT_SUMMARY_MAX_LENGTH = 200;

    @Value("${app.openai.api-key:}")
    private String apiKey;

    @Value("${app.openai.model:gpt-4.1-mini}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();
    private final ProductService productService;

    public ChatResponse chat(String message, String conversationId) {
        String convId = conversationId != null && !conversationId.isBlank()
                ? conversationId
                : "conv-" + System.currentTimeMillis();

        if (apiKey == null || apiKey.isBlank()) {
            return ChatResponse.builder()
                    .reply("AI 연동이 설정되지 않았습니다. OPENAI_API_KEY를 설정해 주세요. (요청: " + message + ")")
                    .conversationId(convId)
                    .build();
        }

        try {
            String catalogText = buildProductCatalogText();
            List<Map<String, Object>> messages = new ArrayList<>();
            if (catalogText != null && !catalogText.isBlank()) {
                messages.add(Map.of(
                        "role", "system",
                        "content", "당신은 이 쇼핑몰의 상담원입니다. 아래 제품 카탈로그는 참고용입니다. 이 정보를 바탕으로 고객 질문에 답하고, 적절한 제품을 추천해 주세요.\n"
                                + "규칙: 카탈로그의 가격·무게·높이·가동시간·배터리·속도·요약을 참고해 정확히 답하세요. 없는 정보는 지어내지 마세요.\n"
                                + "답변에는 카탈로그 원문(id, 목록 형식)을 그대로 붙여넣지 말고, 자연스러운 상담 문장으로 답하세요. 다만 예산·가격 비교가 필요할 때는 제품명과 가격을 표나 목록 형태로 정리해 주세요. 제품 분류(카테고리)는 쇼핑몰에 이미 있으므로, 응답은 AI 상담 문장과 필요 시 가격 정리만 출력하세요.\n\n[제품 카탈로그]\n" + catalogText
                ));
            }
            messages.add(Map.of("role", "user", "content", message));

            Map<String, Object> body = Map.of(
                    "model", model,
                    "messages", messages
            );
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(OPENAI_CHAT_URL, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                log.warn("OpenAI API non-OK: {}", response.getStatusCode());
                return fallbackResponse(message, convId);
            }
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isEmpty()) {
                return fallbackResponse(message, convId);
            }
            String content = choices.get(0).path("message").path("content").asText("");
            return ChatResponse.builder()
                    .reply(content.isBlank() ? "응답이 비어 있습니다." : content)
                    .conversationId(convId)
                    .build();
        } catch (Exception e) {
            log.warn("OpenAI chat error", e);
            return ChatResponse.builder()
                    .reply("일시적으로 AI 응답을 생성할 수 없습니다. 잠시 후 다시 시도해 주세요.")
                    .conversationId(convId)
                    .build();
        }
    }

    private String buildProductCatalogText() {
        List<ProductCatalogItem> items = productService.getProductCatalogForAi();
        if (items.isEmpty()) {
            return "";
        }
        return items.stream()
                .map(i -> {
                    String priceStr = i.getPrice() != null
                            ? ("KRW".equalsIgnoreCase(i.getCurrency()) ? i.getPrice().toPlainString() + "원" : "$" + i.getPrice().toPlainString())
                            : "-";
                    StringBuilder line = new StringBuilder();
                    line.append("- id: ").append(i.getId())
                            .append(" | 이름: ").append(nullToEmpty(i.getName()))
                            .append(" | 카테고리: ").append(nullToEmpty(i.getCategoryName()))
                            .append(" | 가격: ").append(priceStr)
                            .append(" | 무게: ").append(nullToEmpty(i.getWeight()))
                            .append(" | 높이: ").append(nullToEmpty(i.getTotalHeight()))
                            .append(" | 가동시간: ").append(nullToEmpty(i.getOperatingTime()))
                            .append(" | 배터리: ").append(nullToEmpty(i.getBattery()))
                            .append(" | 속도: ").append(nullToEmpty(i.getSpeed()))
                            .append(" | 요약: ").append(nullToEmpty(i.getSummary()));
                    return line.toString();
                })
                .collect(Collectors.joining("\n"));
    }

    private static String nullToEmpty(String s) {
        return s != null ? s : "";
    }

    private static ChatResponse fallbackResponse(String message, String convId) {
        return ChatResponse.builder()
                .reply("AI 응답을 가져오지 못했습니다. (요청: " + message + ")")
                .conversationId(convId)
                .build();
    }

    /**
     * 제품 정보(이름, 한줄설명, 상세, 가격·세부 스펙)를 바탕으로 AI 채팅/카탈로그용 요약을 생성한다.
     * API 키가 없거나 실패 시 null 반환.
     */
    public String generateProductSummary(String name, String shortDescription, String content,
                                         java.math.BigDecimal price, String currency,
                                         String weight, String totalHeight, String operatingTime, String battery, String speed,
                                         String categoryName) {
        if (apiKey == null || apiKey.isBlank()) {
            return null;
        }
        String contentPlain = content != null ? content.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim() : "";
        if (contentPlain.length() > 800) {
            contentPlain = contentPlain.substring(0, 800) + "...";
        }
        StringBuilder input = new StringBuilder();
        input.append("제품명: ").append(name != null ? name : "");
        if (categoryName != null && !categoryName.isBlank()) {
            input.append("\n카테고리: ").append(categoryName);
        }
        if (price != null) {
            String priceStr = currency != null && "KRW".equalsIgnoreCase(currency.trim())
                    ? price.toPlainString() + "원"
                    : "$" + price.toPlainString();
            input.append("\n가격: ").append(priceStr);
        }
        if (weight != null && !weight.isBlank()) input.append("\n무게: ").append(weight);
        if (totalHeight != null && !totalHeight.isBlank()) input.append("\n높이: ").append(totalHeight);
        if (operatingTime != null && !operatingTime.isBlank()) input.append("\n가동시간: ").append(operatingTime);
        if (battery != null && !battery.isBlank()) input.append("\n배터리: ").append(battery);
        if (speed != null && !speed.isBlank()) input.append("\n속도: ").append(speed);
        if (shortDescription != null && !shortDescription.isBlank()) {
            input.append("\n한줄설명: ").append(shortDescription);
        }
        if (!contentPlain.isBlank()) {
            input.append("\n상세: ").append(contentPlain);
        }
        String userMessage = "아래 쇼핑몰 제품 정보를 바탕으로, 고객 상담·추천용 요약 문장을 **한국어로** " + PRODUCT_SUMMARY_MAX_LENGTH + "자 이내로 작성해 주세요.\n"
                + "채팅 시 카탈로그에 가격·무게·높이·배터리·속도는 이미 따로 전달되므로, 요약문에는 가격·스펙 숫자를 넣지 말고, 용도·특징·어떤 상황/누구에게 맞는지 위주로만 작성해 주세요.\n\n" + input;
        List<Map<String, Object>> messages = List.of(
                Map.of("role", "user", "content", userMessage)
        );
        Map<String, Object> body = Map.of(
                "model", model,
                "messages", messages,
                "max_tokens", 150
        );
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(OPENAI_CHAT_URL, HttpMethod.POST, entity, String.class);
            if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
                return null;
            }
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isEmpty()) {
                return null;
            }
            String summary = choices.get(0).path("message").path("content").asText("").trim();
            if (summary.length() > PRODUCT_SUMMARY_MAX_LENGTH) {
                summary = summary.substring(0, PRODUCT_SUMMARY_MAX_LENGTH);
            }
            return summary.isBlank() ? null : summary;
        } catch (Exception e) {
            log.warn("OpenAI product summary generation failed", e);
            return null;
        }
    }
}
