package com.unicorn.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class OAuthProviderService {

    private static final String NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";
    private static final String NAVER_USERINFO_URL = "https://openapi.naver.com/v1/nid/me";
    private static final String KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String KAKAO_USERINFO_URL = "https://kapi.kakao.com/v2/user/me";
    private static final String GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
    private static final String GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.oauth.naver.client-id:}")
    private String naverClientId;
    @Value("${app.oauth.naver.client-secret:}")
    private String naverClientSecret;
    @Value("${app.oauth.kakao.client-id:}")
    private String kakaoClientId;
    @Value("${app.oauth.kakao.client-secret:}")
    private String kakaoClientSecret;
    @Value("${app.oauth.google.client-id:}")
    private String googleClientId;
    @Value("${app.oauth.google.client-secret:}")
    private String googleClientSecret;

    @Value("${app.oauth.callback-base-url:http://localhost:18080/api/v1}")
    private String callbackBaseUrl;

    private static final String NAVER_AUTHORIZE_URL = "https://nid.naver.com/oauth2.0/authorize";
    private static final String KAKAO_AUTHORIZE_URL = "https://kauth.kakao.com/oauth/authorize";
    private static final String GOOGLE_AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth";

    private static final String CALLBACK_PATH = "/auth/callback";

    public String buildNaverAuthorizeUrl(String state) {
        if (naverClientId.isBlank()) {
            throw new IllegalStateException("네이버 OAuth 클라이언트 ID가 없습니다.");
        }
        String redirectUri = callbackBaseUrl + CALLBACK_PATH;
        String encodedRedirect = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
        String safeState = (state != null && !state.isBlank()) ? URLEncoder.encode(state, StandardCharsets.UTF_8) : "";
        return NAVER_AUTHORIZE_URL + "?response_type=code&client_id=" + naverClientId
                + "&redirect_uri=" + encodedRedirect + "&state=" + safeState;
    }

    public String buildKakaoAuthorizeUrl(String state) {
        if (kakaoClientId.isBlank()) {
            throw new IllegalStateException("카카오 OAuth 클라이언트 ID가 없습니다.");
        }
        String redirectUri = callbackBaseUrl + CALLBACK_PATH;
        String encodedRedirect = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
        String url = KAKAO_AUTHORIZE_URL + "?response_type=code&client_id=" + kakaoClientId
                + "&redirect_uri=" + encodedRedirect;
        if (state != null && !state.isBlank()) {
            url += "&state=" + URLEncoder.encode(state, StandardCharsets.UTF_8);
        }
        return url;
    }

    public String buildGoogleAuthorizeUrl(String state) {
        if (googleClientId.isBlank()) {
            throw new IllegalStateException("구글 OAuth 클라이언트 ID가 없습니다.");
        }
        String redirectUri = callbackBaseUrl + CALLBACK_PATH;
        String encodedRedirect = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8);
        String scope = URLEncoder.encode("openid email profile", StandardCharsets.UTF_8);
        String url = GOOGLE_AUTHORIZE_URL + "?response_type=code&client_id=" + googleClientId
                + "&redirect_uri=" + encodedRedirect + "&scope=" + scope;
        if (state != null && !state.isBlank()) {
            url += "&state=" + URLEncoder.encode(state, StandardCharsets.UTF_8);
        }
        return url;
    }

    public String exchangeCodeForNaverToken(String code, String state, String redirectUri) {
        if (naverClientId.isBlank() || naverClientSecret.isBlank()) {
            throw new IllegalStateException("네이버 OAuth 클라이언트 설정이 없습니다.");
        }
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", naverClientId);
        body.add("client_secret", naverClientSecret);
        body.add("code", code);
        if (redirectUri != null && !redirectUri.isBlank()) {
            body.add("redirect_uri", redirectUri);
        }
        if (state != null && !state.isBlank()) {
            body.add("state", state);
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(NAVER_TOKEN_URL, HttpMethod.POST, entity, String.class);
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new IllegalArgumentException("네이버 토큰 교환에 실패했습니다.");
        }
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            String accessToken = root.path("access_token").asText(null);
            if (accessToken == null || accessToken.isBlank()) {
                throw new IllegalArgumentException("네이버 토큰 응답이 올바르지 않습니다.");
            }
            return accessToken;
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) e;
            }
            log.warn("Naver token parse error", e);
            throw new IllegalArgumentException("네이버 토큰 응답을 처리할 수 없습니다.");
        }
    }

    public String exchangeCodeForKakaoToken(String code, String redirectUri) {
        if (kakaoClientId.isBlank() || kakaoClientSecret.isBlank()) {
            throw new IllegalStateException("카카오 OAuth 클라이언트 설정이 없습니다.");
        }
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", kakaoClientId);
        body.add("client_secret", kakaoClientSecret);
        body.add("code", code);
        body.add("redirect_uri", redirectUri != null ? redirectUri : "");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(KAKAO_TOKEN_URL, HttpMethod.POST, entity, String.class);
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new IllegalArgumentException("카카오 토큰 교환에 실패했습니다.");
        }
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            String accessToken = root.path("access_token").asText(null);
            if (accessToken == null || accessToken.isBlank()) {
                throw new IllegalArgumentException("카카오 토큰 응답이 올바르지 않습니다.");
            }
            return accessToken;
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) e;
            }
            log.warn("Kakao token parse error", e);
            throw new IllegalArgumentException("카카오 토큰 응답을 처리할 수 없습니다.");
        }
    }

    public String exchangeCodeForGoogleToken(String code, String redirectUri) {
        if (googleClientId.isBlank() || googleClientSecret.isBlank()) {
            throw new IllegalStateException("구글 OAuth 클라이언트 설정이 없습니다.");
        }
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", googleClientId);
        body.add("client_secret", googleClientSecret);
        body.add("code", code);
        body.add("redirect_uri", redirectUri != null ? redirectUri : "");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(GOOGLE_TOKEN_URL, HttpMethod.POST, entity, String.class);
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            throw new IllegalArgumentException("구글 토큰 교환에 실패했습니다.");
        }
        try {
            JsonNode root = objectMapper.readTree(response.getBody());
            String accessToken = root.path("access_token").asText(null);
            if (accessToken == null || accessToken.isBlank()) {
                throw new IllegalArgumentException("구글 토큰 응답이 올바르지 않습니다.");
            }
            return accessToken;
        } catch (Exception e) {
            if (e instanceof IllegalArgumentException) {
                throw (IllegalArgumentException) e;
            }
            log.warn("Google token parse error", e);
            throw new IllegalArgumentException("구글 토큰 응답을 처리할 수 없습니다.");
        }
    }

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
