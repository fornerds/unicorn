package com.unicorn.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unicorn.dto.ai.ChatResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiChatService {

    private static final String OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

    @Value("${app.openai.api-key:}")
    private String apiKey;

    @Value("${app.openai.model:gpt-4.1-mini}")
    private String model;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

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
            Map<String, Object> body = Map.of(
                    "model", model,
                    "messages", List.of(Map.of("role", "user", "content", message))
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

    private static ChatResponse fallbackResponse(String message, String convId) {
        return ChatResponse.builder()
                .reply("AI 응답을 가져오지 못했습니다. (요청: " + message + ")")
                .conversationId(convId)
                .build();
    }
}
