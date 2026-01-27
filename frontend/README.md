# Unicorn Frontend

Unicorn 프로젝트의 프론트엔드 애플리케이션입니다.

## 기술 스택

- **Next.js 14+** (App Router)
- **React 18+**
- **TypeScript** (엄격 모드)
- **Tailwind CSS**
- **TanStack Query** (React Query)
- **Zustand**

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ui/              # 기본 UI 컴포넌트 (Button, Input 등)
│   ├── layout/          # 레이아웃 컴포넌트 (Header, Footer 등)
│   └── features/        # 기능별 컴포넌트
├── hooks/               # React Query hooks 및 커스텀 훅
│   ├── useAuth.ts
│   ├── useProfile.ts
│   ├── useMutations.ts
│   └── useProducts.ts
├── stores/              # Zustand 스토어
│   ├── authStore.ts
│   └── uiStore.ts
├── utils/               # 유틸리티 함수
│   ├── auth.ts          # JWT 토큰 처리
│   ├── validation.ts    # 데이터 검증
│   ├── constants.ts     # 상수 정의 (라우트 등)
│   └── cn.ts            # Tailwind 클래스 병합 유틸리티
├── lib/                 # 라이브러리 설정
│   ├── database.ts      # 데이터베이스 클라이언트
│   ├── react-query.ts   # React Query 설정
│   └── types.ts         # 공통 타입 정의
├── styles/              # 전역 스타일
│   └── globals.css      # Tailwind CSS 및 전역 스타일
└── app/                 # Next.js App Router
    ├── layout.tsx       # 루트 레이아웃
    ├── page.tsx         # 메인 페이지 (AI 챗 포함)
    ├── products/        # 제품 관련 페이지
    ├── news/            # 뉴스 관련 페이지
    ├── login/           # 로그인 페이지
    ├── cart/            # 장바구니 페이지
    ├── checkout/        # 결제 페이지
    └── my/              # 마이페이지
```

## 시작하기

### 필수 요구사항

- Node.js 18+ 
- npm 또는 yarn

### 설치

```bash
npm install
# 또는
yarn install
```

### 개발 서버 실행 (HMR 활성화)

```bash
npm run dev
# 또는
yarn dev
```

개발 서버가 시작되면 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

**HMR (Hot Module Replacement) 기능:**
- 코드를 수정하면 브라우저가 자동으로 새로고침됩니다
- 컴포넌트 상태를 유지하면서 변경사항만 업데이트됩니다
- 빠른 개발 피드백을 제공합니다

### 빌드 및 프로덕션

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 타입 체크
npm run type-check

# 린트
npm run lint
```

## 주요 기능

- **인증**: JWT 기반 인증 시스템
- **상태 관리**: React Query (서버 상태) + Zustand (클라이언트 상태)
- **스타일링**: Tailwind CSS 유틸리티 퍼스트 접근
- **타입 안정성**: TypeScript 엄격 모드
- **낙관적 업데이트**: 즉각적인 UI 피드백

## 정적 Assets 관리

정적 파일(이미지, 아이콘, 폰트 등)은 `public/` 폴더에 저장합니다.

```
public/
├── images/      # 이미지 파일
├── icons/       # 아이콘 파일
├── fonts/       # 폰트 파일
├── videos/      # 영상 파일
└── favicons/    # 파비콘 파일
```

**사용 예시:**
```tsx
// 이미지 사용
import Image from 'next/image';
<Image src="/images/logo.png" alt="Logo" width={200} height={50} />

// 또는 유틸리티 사용
import { getImagePath } from '@/utils/assets';
<img src={getImagePath('logo.png')} alt="Logo" />

// 영상 사용
import { Video } from '@/components/ui/Video';
<Video src="intro.mp4" controls width={800} height={450} />

// 또는 직접 사용
import { getVideoPath } from '@/utils/assets';
<video src={getVideoPath('intro.mp4')} controls />
```

자세한 내용은 [`public/README.md`](./public/README.md)를 참고하세요.

## 문서

자세한 아키텍처 정보는 [`docs/frontend-architecture.md`](../docs/frontend-architecture.md)를 참고하세요.
