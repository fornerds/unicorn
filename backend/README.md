# Unicorn Backend

Spring Boot 3.5 (Java 21, Gradle) REST API. 구현 계획: `docs/backend-implementation-plan.md`

## 기술 스택

- Java 21, Spring Boot 3.5, Gradle
- Spring Security (stateless, 단계 3에서 JWT 적용 예정)
- MySQL 8 (Docker Compose), Hibernate JPA (ddl-auto: update)
- API prefix: `/api/v1`
- Swagger UI: `/api/v1/swagger-ui.html`, API Docs: `/api/v1/api-docs`
- 공통 응답: `{ "code", "data", "message" }`
- 헬스체크: `/api/v1/actuator/health`

## 로컬 실행

1. **MySQL 기동** (프로젝트 루트에서)

   ```bash
   docker compose up -d
   ```

2. **환경 변수**  
   프로젝트 루트에 `.env` 파일을 두고 다음 변수를 설정한다. (예시)

   - `SPRING_PROFILES_ACTIVE=dev`
   - `MYSQL_HOST=localhost`, `MYSQL_PORT=3306`, `MYSQL_DATABASE=unicorn`, `MYSQL_USER=unicorn`, `MYSQL_PASSWORD=unicorn`
   - `CORS_ALLOWED_ORIGINS=http://localhost:3000`

3. **백엔드 실행**

   ```bash
   cd backend
   ./gradlew bootRun
   ```

- API Base: http://localhost:8080/api/v1
- Swagger: http://localhost:8080/api/v1/swagger-ui.html
- Health: http://localhost:8080/api/v1/actuator/health

## Docker 이미지 빌드 (backend만)

```bash
cd backend
./gradlew bootJar
docker build -t unicorn-backend .
```

또는 Dockerfile 멀티스테이지로:

```bash
cd backend
docker build -t unicorn-backend .
```
