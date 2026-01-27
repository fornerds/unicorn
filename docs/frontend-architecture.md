# 프론트엔드 아키텍처

## 개요

이 문서는 Unicorn 프로젝트의 프론트엔드 아키텍처를 설명합니다. 불필요한 중간 레이어를 제거하고 직접적인 데이터 흐름을 통해 성능과 유지보수성을 개선한 아키텍처입니다.

## 핵심 원칙

- **직접적인 데이터 흐름**: 불필요한 추상화 레이어 제거
- **명확한 책임 분리**: 각 레이어의 역할을 명확히 정의
- **타입 안정성**: TypeScript 엄격 모드 및 데이터베이스 스키마와 일치하는 타입 정의
- **성능 최적화**: 적절한 캐싱 전략 및 낙관적 업데이트

## 기술 스택

### 핵심 프레임워크
- **Next.js 14+ (App Router)**: 서버 컴포넌트 및 라우팅
- **React 18+**: UI 라이브러리
- **TypeScript**: 타입 안정성 (엄격 모드)

### 상태 관리
- **TanStack Query (React Query)**: 서버 상태 관리 및 캐싱
- **Zustand**: 클라이언트 전역 상태 관리
- **localStorage**: 인증 토큰 및 사용자 설정 저장

### 인증 및 보안
- **NextAuth.js** 또는 **커스텀 OAuth**: SNS 로그인
- **JWT**: 인증 토큰

### 스타일링
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **CSS Modules**: 컴포넌트별 스타일 격리 (필요시)

### 기타 라이브러리
- **TanStack AI**: AI API 상태 및 UX 표현
- **next/image**: 이미지 최적화
- **PG사 SDK**: 결제 처리 (PayPal 예상)

## 폴더 구조

```
src/
├── components/          # 재사용 가능한 UI 컴포넌트
│   ├── ui/              # 기본 UI 컴포넌트 (Button, Input 등)
│   ├── layout/          # 레이아웃 컴포넌트 (Header, Footer 등)
│   └── features/        # 기능별 컴포넌트
├── hooks/               # React Query hooks 및 커스텀 훅
│   ├── useProfile.ts
│   ├── useAuth.ts
│   ├── useMutations.ts
│   └── useProducts.ts
├── stores/              # Zustand 스토어
│   ├── authStore.ts
│   └── uiStore.ts
├── utils/               # 유틸리티 함수
│   ├── auth.ts          # JWT 토큰 처리
│   ├── validation.ts    # 데이터 검증
│   └── constants.ts     # 상수 정의
├── lib/                 # 라이브러리 설정
│   ├── database.ts      # 데이터베이스 클라이언트
│   ├── react-query.ts   # React Query 설정
│   └── types.ts         # 공통 타입 정의
├── styles/              # 전역 스타일
│   └── globals.css      # Tailwind CSS 및 전역 스타일
└── app/                 # Next.js App Router
    ├── layout.tsx       # 루트 레이아웃
    ├── page.tsx         # 메인 페이지 (AI 챗 포함)
    ├── products/
    ├── news/
    ├── login/
    ├── cart/
    ├── checkout/
    └── my/
```

## 라우트 구조

```typescript
export const ROUTES = {
  HOME: '/',

  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}`,

  // News
  NEWS: '/news',
  NEWS_DETAIL: (id: string | number) => `/news/${id}`,

  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  SNS_LOGIN: '/login/sns',

  // Purchase
  CART: '/cart',
  CHECKOUT: '/checkout',
  CHECKOUT_COMPLETE: '/checkout/complete',

  // My Page
  MY_PAGE: '/my',
  MY_LIKES: '/my/likes',
  MY_ORDERS: '/my/orders',
  MY_PROFILE: '/my/profile',

  // Company
  ABOUT: '/about',

  // AI Chat (state-based, main page)
  AI_CHAT: {
    OPEN: '/?ai=open',
    WITH_QUERY: (query: string) =>
      `/?ai=open&q=${encodeURIComponent(query)}`,
  },
} as const;
```

## 렌더링 전략

| 페이지       | 렌더링 방식      | 이유                                    |
| ---------- | ------------ | ------------------------------------- |
| 메인        | SSG or ISR   | 정적 콘텐츠, SEO 중요                        |
| 제품 목록     | SSG + ISR    | 정적 생성 + 주기적 갱신                          |
| 제품 상세     | SSG + ISR    | 정적 생성 + 주기적 갱신                          |
| 뉴스        | SSG          | 완전 정적 콘텐츠                              |
| 로그인       | CSR          | 사용자 인터랙션 중심, SEO 불필요                  |
| 장바구니      | CSR          | 사용자별 동적 데이터, SEO 불필요                  |
| 결제        | CSR          | 민감한 정보, 클라이언트 사이드 처리 필요              |
| 마이페이지    | SSR or CSR   | 사용자별 데이터, 보안 고려                        |

## 데이터 흐름

### 1. 인증 흐름

```
1. 사용자 로그인 요청
   ↓
2. 서버에서 JWT 토큰 발급
   ↓
3. JWT 토큰을 localStorage에 저장
   ↓
4. 모든 API 요청에서 JWT 토큰을 헤더에 포함
   ↓
5. 서버에서 JWT에서 userId 추출
   ↓
6. 필요시 토큰 갱신 (refresh token)
```

**구현 예시:**

```typescript
// utils/auth.ts
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

export const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || null;
  } catch {
    return null;
  }
};
```

### 2. 데이터 조회 흐름

```
1. Component에서 React Query hook 호출
   ↓
2. hook에서 localStorage에서 JWT 토큰 확인
   ↓
3. JWT에서 userId 추출
   ↓
4. 직접 데이터베이스 쿼리 실행 (서버 액션 또는 API 라우트)
   ↓
5. React Query가 결과 캐싱 및 상태 관리
   ↓
6. Component에 데이터 반환
```

**구현 예시:**

```typescript
// hooks/useProfile.ts
import { useQuery } from '@tanstack/react-query';
import { getToken, getUserIdFromToken } from '@/utils/auth';
import { fetchUserProfile } from '@/lib/database';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');
      
      const userId = getUserIdFromToken(token);
      if (!userId) throw new Error('Invalid token');
      
      return await fetchUserProfile(userId);
    },
    enabled: !!getToken(),
  });
};
```

### 3. 데이터 업데이트 흐름

```
1. Component에서 React Query mutation 호출
   ↓
2. 데이터베이스 직접 업데이트 (서버 액션 또는 API 라우트)
   ↓
3. React Query가 관련 캐시 무효화
   ↓
4. Zustand로 즉시 UI 상태 업데이트 (필요시)
   ↓
5. 낙관적 업데이트 적용
```

**구현 예시:**

```typescript
// hooks/useMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateUserProfile } from '@/lib/database';
import { useAuthStore } from '@/stores/authStore';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateAuthState = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return await updateUserProfile(data);
    },
    onMutate: async (newData) => {
      // 낙관적 업데이트
      await queryClient.cancelQueries({ queryKey: ['profile'] });
      
      const previousProfile = queryClient.getQueryData(['profile']);
      
      queryClient.setQueryData(['profile'], (old: any) => ({
        ...old,
        ...newData,
      }));
      
      // Zustand 상태도 즉시 업데이트
      updateAuthState(newData);
      
      return { previousProfile };
    },
    onError: (err, newData, context) => {
      // 롤백
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
```

### 4. 낙관적 업데이트 (Optimistic Updates)

좋아요, 회원정보 수정 등 즉각적인 피드백이 필요한 작업에 대해 낙관적 업데이트를 적용합니다.

**특징:**
- UI를 즉시 업데이트하여 사용자 경험 향상
- 서버 응답 전에 변경사항 반영
- 실패 시 자동 롤백
- 관련된 모든 페이지에서 일관된 상태 유지

**구현 예시 (좋아요 기능):**

```typescript
// hooks/useMutations.ts
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, isLiked }: { productId: string; isLiked: boolean }) => {
      return await toggleProductLike(productId, isLiked);
    },
    onMutate: async ({ productId, isLiked }) => {
      // 관련된 모든 쿼리 취소
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['product', productId] });
      await queryClient.cancelQueries({ queryKey: ['my-likes'] });

      // 이전 상태 저장
      const previousProducts = queryClient.getQueryData(['products']);
      const previousProduct = queryClient.getQueryData(['product', productId]);
      const previousLikes = queryClient.getQueryData(['my-likes']);

      // 낙관적 업데이트: 제품 목록
      queryClient.setQueryData(['products'], (old: any) => {
        return old?.map((product: any) =>
          product.id === productId
            ? { ...product, isLiked: !isLiked, likesCount: product.likesCount + (isLiked ? -1 : 1) }
            : product
        );
      });

      // 낙관적 업데이트: 제품 상세
      queryClient.setQueryData(['product', productId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          isLiked: !isLiked,
          likesCount: old.likesCount + (isLiked ? -1 : 1),
        };
      });

      // 낙관적 업데이트: 내 좋아요 목록
      queryClient.setQueryData(['my-likes'], (old: any) => {
        if (!old) return old;
        if (isLiked) {
          return old.filter((item: any) => item.id !== productId);
        } else {
          return [...old, { id: productId, ...previousProduct }];
        }
      });

      return { previousProducts, previousProduct, previousLikes };
    },
    onError: (err, variables, context) => {
      // 롤백
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
      if (context?.previousProduct) {
        queryClient.setQueryData(['product', variables.productId], context.previousProduct);
      }
      if (context?.previousLikes) {
        queryClient.setQueryData(['my-likes'], context.previousLikes);
      }
    },
    onSettled: (data, error, variables) => {
      // 최종 동기화
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.productId] });
      queryClient.invalidateQueries({ queryKey: ['my-likes'] });
    },
  });
};
```

## 상태 관리 전략

### React Query (서버 상태)

**사용 사례:**
- 사용자 프로필
- 제품 목록 및 상세
- 뉴스 목록
- 장바구니
- 주문 내역
- 좋아요 목록

**설정:**

```typescript
// lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      cacheTime: 1000 * 60 * 30, // 30분
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Zustand (클라이언트 상태)

**사용 사례:**
- UI 상태 (모달, 사이드바 등)
- 인증 상태 (현재 사용자 정보)
- 테마 설정
- 장바구니 UI 상태

**구현 예시:**

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

```typescript
// stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isAIChatOpen: boolean;
  isCartOpen: boolean;
  openAIChat: () => void;
  closeAIChat: () => void;
  toggleCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAIChatOpen: false,
  isCartOpen: false,
  openAIChat: () => set({ isAIChatOpen: true }),
  closeAIChat: () => set({ isAIChatOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
}));
```

### localStorage

**사용 사례:**
- JWT 인증 토큰
- 사용자 설정 (언어, 테마 등)
- 최근 본 제품 (선택적)

**주의사항:**
- 민감한 정보는 저장하지 않음
- 토큰은 만료 시간을 확인하고 갱신 필요
- SSR 환경에서는 `typeof window !== 'undefined'` 체크 필수

## 타입 정의

### 데이터베이스 스키마와 일치하는 타입

```typescript
// lib/types.ts

// 데이터베이스 스키마 기반 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  likesCount: number;
  isLiked?: boolean; // 클라이언트에서 계산
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### API 응답 타입 검증

```typescript
// utils/validation.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  stock: z.number().int().nonnegative(),
  likesCount: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const validateApiResponse = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};
```

## 데이터베이스 접근

### 직접 쿼리 패턴

서버 액션이나 API 라우트에서 직접 데이터베이스에 접근하여 불필요한 레이어를 제거합니다.

```typescript
// lib/database.ts
import { db } from './db'; // 데이터베이스 클라이언트

export const fetchUserProfile = async (userId: string): Promise<User> => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  const updated = await db.user.update({
    where: { id: userId },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });

  return updated;
};
```

## 스타일링 전략

### Tailwind CSS

**원칙:**
- 유틸리티 퍼스트 접근 방식
- 컴포넌트별로 필요한 클래스만 사용
- 커스텀 디자인 시스템 구축 (색상, 타이포그래피, 간격 등)

**설정:**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#your-primary-color',
          light: '#your-primary-light',
          dark: '#your-primary-dark',
        },
        // 커스텀 색상 팔레트
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        // 커스텀 폰트
      },
      spacing: {
        // 커스텀 간격
      },
    },
  },
  plugins: [],
};

export default config;
```

**사용 가이드:**

1. **인라인 스타일링**: 컴포넌트에서 직접 Tailwind 클래스 사용
   ```tsx
   <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
     Click me
   </button>
   ```

2. **조건부 클래스**: `clsx` 또는 `cn` 유틸리티 사용
   ```tsx
   import { cn } from '@/utils/cn';
   
   <button className={cn(
     "px-4 py-2 rounded-lg",
     isActive && "bg-primary text-white",
     !isActive && "bg-gray-200 text-gray-700"
   )}>
     Button
   </button>
   ```

3. **컴포넌트 변형**: `cva` (class-variance-authority) 사용
   ```tsx
   import { cva, type VariantProps } from 'class-variance-authority';
   
   const buttonVariants = cva(
     "px-4 py-2 rounded-lg font-medium transition-colors",
     {
       variants: {
         variant: {
           primary: "bg-primary text-white hover:bg-primary-dark",
           secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
         },
         size: {
           sm: "px-3 py-1 text-sm",
           md: "px-4 py-2",
           lg: "px-6 py-3 text-lg",
         },
       },
       defaultVariants: {
         variant: "primary",
         size: "md",
       },
     }
   );
   ```

4. **전역 스타일**: `globals.css`에서 Tailwind 지시문 및 커스텀 CSS
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   
   @layer base {
     :root {
       --primary: #your-color;
     }
   }
   
   @layer components {
     .btn-primary {
       @apply px-4 py-2 bg-primary text-white rounded-lg;
     }
   }
   ```

**베스트 프랙티스:**
- 반복되는 클래스 조합은 컴포넌트로 추출
- 디자인 토큰(색상, 간격 등)은 `tailwind.config.ts`에서 중앙 관리
- 반응형 디자인은 모바일 퍼스트 접근
- 다크 모드 지원 시 `dark:` 변형 활용

## 성능 최적화

### 1. 캐싱 전략

- **React Query**: 자동 캐싱 및 백그라운드 갱신
- **Next.js Image**: 이미지 최적화 및 자동 WebP 변환
- **SSG/ISR**: 정적 페이지 생성으로 초기 로딩 시간 단축

### 2. 코드 스플리팅

- Next.js App Router의 자동 코드 스플리팅 활용
- 동적 import를 통한 필요시 컴포넌트 로딩

### 3. 낙관적 업데이트

- 즉각적인 UI 피드백으로 사용자 경험 향상
- 서버 응답 대기 시간 감소 체감

### 4. CSS 최적화

- Tailwind CSS의 JIT 모드로 사용된 클래스만 번들에 포함
- PurgeCSS 자동 적용으로 미사용 스타일 제거

## 보안 고려사항

1. **JWT 토큰 관리**
   - localStorage에 저장 (XSS 방지를 위한 추가 보안 조치 필요)
   - 토큰 만료 시간 확인 및 자동 갱신
   - 민감한 정보는 토큰에 포함하지 않음

2. **API 요청 보안**
   - 모든 요청에 JWT 토큰 포함
   - HTTPS 통신 필수
   - CORS 설정 적절히 구성

3. **입력 검증**
   - 클라이언트 및 서버 양쪽에서 검증
   - SQL Injection 방지 (Prisma 등 ORM 사용)
   - XSS 방지 (입력 데이터 이스케이프)

## 테스트 전략

1. **단위 테스트**: 유틸리티 함수 및 훅
2. **통합 테스트**: React Query 훅 및 Zustand 스토어
3. **E2E 테스트**: 주요 사용자 플로우 (Playwright)

## 마이그레이션 가이드

기존 코드베이스에서 이 아키텍처로 마이그레이션할 때:

1. Redux/Context API → Zustand로 전환
2. 기존 API 클라이언트 → React Query hooks로 전환
3. 서버 상태와 클라이언트 상태 명확히 분리
4. 타입 정의를 데이터베이스 스키마와 동기화

## 참고 자료

- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)
- [TypeScript 엄격 모드](https://www.typescriptlang.org/tsconfig#strict)
