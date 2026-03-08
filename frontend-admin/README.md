# Unicorn Admin (frontend-admin)

Unicorn 백엔드 관리자 전용 프론트엔드. digilog의 frontend-admin 구조를 참고하여 Vite + React + TypeScript + Tailwind로 구성.

## 기술 스택

- Vite, React 18, TypeScript
- React Router 6
- Tailwind CSS
- Zustand (인증 상태)

## 사전 조건

- 백엔드 API가 `http://localhost:8080`에서 기동 중이어야 함.
- 관리자 계정 (dev 시드: `admin@unicorn.dev` / `password`)

## 설치 및 실행

```bash
cd frontend-admin
npm install
npm run dev
```

- 개발 서버: http://localhost:3001
- API 요청은 `/api/v1` 기준으로 프록시되어 `http://localhost:8080/api/v1`로 전달됨.

## 환경 변수

- `VITE_API_BASE_URL`: API 베이스 URL (기본: `/api/v1`, 프록시 사용 시 그대로 두면 됨)

## 메뉴

- 대시보드, 회원 관리, 카테고리, 제품 관리, 주문 관리, 문의 관리, 뉴스 관리, 태그 관리, 기분 질문, 설정

## 빌드

```bash
npm run build
```

산출물은 `dist/`에 생성됨.
