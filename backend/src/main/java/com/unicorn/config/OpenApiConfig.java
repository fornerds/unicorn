package com.unicorn.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("${server.servlet.context-path:/api/v1}")
    private String contextPath;

    @Value("${app.api.server-url.local:http://localhost:8080}")
    private String localServerUrl;

    @Value("${app.api.server-url.production:https://api.example.com}")
    private String productionServerUrl;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Bean
    public OpenAPI openAPI() {
        List<Server> servers = new ArrayList<>();
        String localFull = localServerUrl + contextPath;
        String productionFull = productionServerUrl + contextPath;
        if ("prod".equalsIgnoreCase(activeProfile)) {
            servers.add(new Server().url(productionFull).description("Production"));
        } else {
            servers.add(new Server().url(localFull).description("Local"));
        }

        return new OpenAPI()
                .info(new Info()
                        .title("Unicorn API")
                        .description("Unicorn 프로젝트 REST API. 관리자 API는 태그가 \"관리자 - ...\" 로 구분됩니다.")
                        .version("1.0.0"))
                .servers(servers)
                .addTagsItem(new Tag().name("인증").description("회원가입, 로그인, OAuth, 비밀번호 찾기"))
                .addTagsItem(new Tag().name("사용자 - 프로필/찜/주문").description("내 정보·찜·주문 목록"))
                .addTagsItem(new Tag().name("카테고리").description("제품 카테고리 조회"))
                .addTagsItem(new Tag().name("제품").description("제품 목록·상세"))
                .addTagsItem(new Tag().name("장바구니").description("장바구니 CRUD"))
                .addTagsItem(new Tag().name("주문").description("주문 생성·상세"))
                .addTagsItem(new Tag().name("결제").description("결제 확인"))
                .addTagsItem(new Tag().name("주소").description("주소 검색"))
                .addTagsItem(new Tag().name("AI").description("기분 질문·AI 채팅"))
                .addTagsItem(new Tag().name("업로드").description("이미지 업로드"))
                .addTagsItem(new Tag().name("관리자 - 인증").description("관리자 로그인·토큰 재발급 API"))
                .addTagsItem(new Tag().name("관리자 - 회원").description("관리자 회원 관리 API"))
                .addTagsItem(new Tag().name("관리자 - 카테고리").description("관리자 카테고리 관리 API"))
                .addTagsItem(new Tag().name("관리자 - 제품").description("관리자 제품 관리 API"))
                .addTagsItem(new Tag().name("관리자 - 주문").description("관리자 주문 관리 API"))
                .addTagsItem(new Tag().name("관리자 - AI 기분질문").description("관리자 기분 질문 관리 API"))
                .addTagsItem(new Tag().name("관리자 - 대시보드").description("관리자 대시보드 API"))
                .addTagsItem(new Tag().name("관리자 - 설정").description("관리자 앱 설정 API"))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Authorization Bearer 또는 access_token 쿠키")));
    }

    /** 전체 API(관리자 포함). Swagger UI 그룹에서 "default" 선택 시 표시. */
    @Bean
    public GroupedOpenApi defaultApi() {
        return GroupedOpenApi.builder()
                .group("default")
                .pathsToMatch("/**")
                .build();
    }

    /** 사용자용 API만 노출. "user" 선택 시 관리자 API(/admin/**) 제외. */
    @Bean
    public GroupedOpenApi userApi() {
        return GroupedOpenApi.builder()
                .group("user")
                .pathsToExclude("/admin/**")
                .build();
    }
}
