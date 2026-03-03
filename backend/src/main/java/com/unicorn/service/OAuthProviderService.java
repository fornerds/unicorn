package com.unicorn.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthProviderService {

    private static final String NAVER_USERINFO_URL = "https://openapi.naver.com/v1/nid/me";
    private static final String KAKAO_USERINFO_URL = "https://kapi.kakao.com/v2/user/me";
    private static final String GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public OAuthUserInfo getNaverUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(NAVER_USERINFO_URL, HttpMethod.GET, entity, String.class);
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new IllegalArgumentException("네이버 인증 정보를 가져올 수 없습니다.");
        }
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode res = root.path("response");
            if (res.isMissingNode()) {
                throw new IllegalArgumentException("네이버 사용자 정보가 올바르지 않습니다.");
            }
            String id = res.path("id").asText("");
            if (id.isBlank()) {
                throw new IllegalArgumentException("네이버 사용자 정보가 올바르지 않습니다.");
            }
            String email = res.path("email").asText("");
            String name = res.path("name").asText("");
            return new OAuthUserInfo(id, email.isBlank() ? null : email, name.isBlank() ? null : name);
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) e;
            }
            log.warn("Naver userinfo parse error", e);
            throw new IllegalArgumentException("네이버 사용자 정보를 처리할 수 없습니다.");
        }
    }

    public OAuthUserInfo getKakaoUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response;
        try {
            response = restTemplate.exchange(KAKAO_USERINFO_URL, HttpMethod.GET, entity, String.class);
        } catch (RestClientException e) {
            log.debug("Kakao API error", e);
            throw new IllegalArgumentException("카카오 인증 정보를 가져올 수 없습니다.");
        }
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new IllegalArgumentException("카카오 인증 정보를 가져올 수 없습니다.");
        }
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode idNode = root.path("id");
            if (idNode.isMissingNode()) {
                throw new IllegalArgumentException("카카오 사용자 정보가 올바르지 않습니다.");
            }
            String id = idNode.isNumber() ? String.valueOf(idNode.asLong()) : idNode.asText("");
            if (id.isBlank() || "0".equals(id)) {
                throw new IllegalArgumentException("카카오 사용자 정보가 올바르지 않습니다.");
            }
            JsonNode kakaoAccount = root.path("kakao_account");
            String email = kakaoAccount.path("email").asText("");
            JsonNode profile = kakaoAccount.path("profile");
            String name = profile.path("nickname").asText("");
            if (name.isBlank()) {
                name = root.path("properties").path("nickname").asText("");
            }
            return new OAuthUserInfo(id, email.isBlank() ? null : email, name.isBlank() ? null : name);
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) e;
            }
            log.warn("Kakao userinfo parse error", e);
            throw new IllegalArgumentException("카카오 사용자 정보를 처리할 수 없습니다.");
        }
    }

    public OAuthUserInfo getGoogleUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response;
        try {
            response = restTemplate.exchange(GOOGLE_USERINFO_URL, HttpMethod.GET, entity, String.class);
        } catch (RestClientException e) {
            log.debug("Google API error", e);
            throw new IllegalArgumentException("구글 인증 정보를 가져올 수 없습니다.");
        }
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new IllegalArgumentException("구글 인증 정보를 가져올 수 없습니다.");
        }
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            String id = root.path("sub").asText("");
            if (id.isBlank()) {
                throw new IllegalArgumentException("구글 사용자 정보가 올바르지 않습니다.");
            }
            String email = root.path("email").asText("");
            String name = root.path("name").asText("");
            return new OAuthUserInfo(id, email.isBlank() ? null : email, name.isBlank() ? null : name);
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) e;
            }
            log.warn("Google userinfo parse error", e);
            throw new IllegalArgumentException("구글 사용자 정보를 처리할 수 없습니다.");
        }
    }

    public record OAuthUserInfo(String providerUserId, String email, String name) {}
}
