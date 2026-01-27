# 폰트 사용 가이드

## 설정된 폰트

### 1. EliceDXNeolliOTF (로컬 폰트)
- **Light** (300): `/fonts/EliceDXNeolliOTF-Light.otf`
- **Medium** (400): `/fonts/EliceDXNeolliOTF-Medium.otf`
- **Bold** (700): `/fonts/EliceDXNeolliOTF-Bold.otf`

### 2. SUIT (웹 폰트)
- CDN을 통해 로드: `https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css`
- 기본 폰트로 설정됨

## 사용 방법

### Tailwind CSS 클래스 사용

```tsx
// SUIT 폰트 (기본)
<div className="font-suit">SUIT 폰트 텍스트</div>

// EliceDXNeolliOTF 폰트
<div className="font-elice">EliceDXNeolliOTF 폰트 텍스트</div>
<div className="font-elice font-light">Light</div>
<div className="font-elice font-normal">Medium</div>
<div className="font-elice font-bold">Bold</div>
```

### 유틸리티 함수 사용

```tsx
import { getEliceFontClass, getSuitFontClass } from '@/utils/fonts';

// EliceDXNeolliOTF
<div className={getEliceFontClass('light')}>Light</div>
<div className={getEliceFontClass('medium')}>Medium</div>
<div className={getEliceFontClass('bold')}>Bold</div>

// SUIT
<div className={getSuitFontClass()}>SUIT 폰트</div>
```

### CSS 변수 사용

```css
/* EliceDXNeolliOTF */
.custom-text {
  font-family: var(--font-elice), sans-serif;
}

/* SUIT */
.suit-text {
  font-family: 'SUIT', sans-serif;
}
```

## 폰트 설정 위치

- **EliceDXNeolliOTF**: `src/styles/globals.css`의 `@font-face`
- **SUIT**: `src/styles/globals.css`의 `@import`
- **Tailwind 설정**: `tailwind.config.ts`의 `fontFamily`
- **Next.js 설정**: `src/app/layout.tsx`의 `localFont`

## 주의사항

1. SUIT 폰트는 CDN을 통해 로드되므로 인터넷 연결이 필요합니다.
2. EliceDXNeolliOTF는 로컬 파일이므로 빌드 시 번들에 포함됩니다.
3. 기본 폰트는 SUIT로 설정되어 있습니다 (`body` 태그에 `font-suit` 클래스).
