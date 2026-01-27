# Public Assets

이 폴더는 정적 파일(assets)을 저장하는 곳입니다. 이 폴더의 모든 파일은 Next.js 빌드 시 그대로 복사되어 배포됩니다.

## 폴더 구조

```
public/
├── images/      # 이미지 파일 (PNG, JPG, WebP 등)
├── icons/       # 아이콘 파일 (SVG, PNG 등)
├── fonts/       # 폰트 파일 (WOFF, WOFF2, TTF 등)
├── videos/      # 영상 파일 (MP4, WebM, MOV 등)
└── favicons/    # 파비콘 파일
```

## 사용 방법

### 이미지 사용

```tsx
// Next.js Image 컴포넌트 사용 (권장)
import Image from 'next/image';

<Image 
  src="/images/logo.png" 
  alt="Logo" 
  width={200} 
  height={50}
/>

// 일반 img 태그 사용
<img src="/images/logo.png" alt="Logo" />
```

### 아이콘 사용

```tsx
// SVG 아이콘
<img src="/icons/icon.svg" alt="Icon" />

// 또는 직접 SVG import
import Icon from '/icons/icon.svg';
```

### 폰트 사용

```css
/* globals.css 또는 CSS 파일에서 */
@font-face {
  font-family: 'CustomFont';
  src: url('/fonts/custom-font.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
}
```

### 영상 사용

```tsx
// HTML5 video 태그 사용
<video 
  src="/videos/intro.mp4" 
  controls 
  width={800} 
  height={450}
  preload="metadata"
>
  <source src="/videos/intro.mp4" type="video/mp4" />
  <source src="/videos/intro.webm" type="video/webm" />
  브라우저가 video 태그를 지원하지 않습니다.
</video>

// 또는 유틸리티 함수 사용
import { getVideoPath } from '@/utils/assets';
<video src={getVideoPath('intro.mp4')} controls />
```

**영상 최적화 팁:**
- MP4 (H.264) 형식 권장 (가장 넓은 호환성)
- WebM 형식도 함께 제공하면 더 나은 압축률
- `preload="metadata"`로 초기 로딩 최적화
- 큰 영상은 CDN 사용 고려

### 파비콘 설정

`app/layout.tsx`에서 메타데이터로 설정:

```tsx
export const metadata: Metadata = {
  icons: {
    icon: '/favicons/favicon.ico',
    apple: '/favicons/apple-touch-icon.png',
  },
};
```

## 접근 경로

- `public/images/logo.png` → `/images/logo.png`
- `public/icons/icon.svg` → `/icons/icon.svg`
- `public/fonts/font.woff2` → `/fonts/font.woff2`
- `public/videos/intro.mp4` → `/videos/intro.mp4`
- `public/favicons/favicon.ico` → `/favicons/favicon.ico`

## 주의사항

1. **파일명**: 공백이나 특수문자 대신 하이픈(-) 사용 권장
2. **최적화**: 이미지는 가능한 한 `next/image` 컴포넌트 사용
3. **크기**: 큰 파일은 CDN 사용 고려
4. **캐싱**: 정적 파일은 자동으로 캐싱됩니다
