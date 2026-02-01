/**
 * 정적 assets 경로를 관리하는 유틸리티
 */

// basePath를 가져오는 헬퍼 함수
const getBasePath = (): string => {
  // 클라이언트 사이드: 현재 경로에서 basePath 추출
  if (typeof window !== 'undefined' && window.location) {
    const path = window.location.pathname;
    if (path.startsWith('/unicorn')) {
      return '/unicorn';
    }
  }
  
  // 환경 변수에서 확인 (Next.js는 빌드 타임에 NEXT_PUBLIC_ 변수를 인라인 치환)
  // 클라이언트 컴포넌트에서도 안전하게 작동하도록 try-catch 사용
  try {
    // Next.js의 __NEXT_DATA__에서 basePath 확인
    if (typeof window !== 'undefined' && (window as any).__NEXT_DATA__?.assetPrefix) {
      return (window as any).__NEXT_DATA__.assetPrefix;
    }
  } catch (e) {
    // 무시
  }
  
  // 기본값
  return '';
};

/**
 * basePath를 포함한 경로 생성 헬퍼
 * 클라이언트와 서버 모두에서 안전하게 작동
 */
export function withBasePath(path: string): string {
  try {
    const basePath = getBasePath();
    
    // basePath가 없으면 원본 경로 반환
    if (!basePath) {
      return path;
    }
    
    // 이미 basePath가 포함되어 있으면 그대로 반환
    if (path.startsWith(basePath)) {
      return path;
    }
    
    // 절대 경로인 경우 basePath 추가
    if (path.startsWith('/')) {
      return `${basePath}${path}`;
    }
    
    // 상대 경로인 경우 그대로 반환
    return path;
  } catch (error) {
    // 에러 발생 시 원본 경로 반환
    console.warn('withBasePath error:', error);
    return path;
  }
}

export const ASSETS = {
  images: {
    logo: '/images/logo.png',
    placeholder: '/images/placeholder.png',
  },
  icons: {
    profile: '/icons/profile.svg',
    cart: '/icons/cart.svg',
    plus: '/icons/plus.svg',
    upload: '/icons/upload.svg',
    arrowDiagonal: '/icons/arrow-diagonal.svg',
    arrowRight: '/icons/arrow-right.svg',
    arrowBack: '/icons/arrow-back.svg',
    arrowDown: '/icons/arrow-down.svg',
    arrowUp: '/icons/arrow-up.svg',
    search: '/icons/search.svg',
    like: '/icons/like.svg',
    delete: '/icons/delete.svg',
    minus: '/icons/minus.svg',
    add: '/icons/add.svg',
    email: '/icons/email.svg',
    download: '/icons/download.svg',
    view: '/icons/view.svg',
    eyeOff: '/icons/eye-off.svg',
    at: '/icons/at.svg',
    weight: '/icons/weight.svg',
    height: '/icons/height.svg',
    time: '/icons/time.svg',
    battery: '/icons/battery.svg',
    speed: '/icons/speed.svg',
    check: '/icons/check.svg',
  },
  fonts: {
    eliceLight: '/fonts/EliceDXNeolliOTF-Light.otf',
    eliceMedium: '/fonts/EliceDXNeolliOTF-Medium.otf',
    eliceBold: '/fonts/EliceDXNeolliOTF-Bold.otf',
    suit: 'https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/static/woff2/SUIT.css',
    cardo: 'Google Fonts (next/font/google)',
  },
  videos: {
    // 영상 경로를 여기에 추가
  },
} as const;

/**
 * 이미지 경로 생성 헬퍼
 */
export const getImagePath = (filename: string): string => {
  return withBasePath(`/images/${filename}`);
};

/**
 * 아이콘 경로 생성 헬퍼
 */
export const getIconPath = (filename: string): string => {
  return withBasePath(`/icons/${filename}`);
};

/**
 * 폰트 경로 생성 헬퍼
 */
export const getFontPath = (filename: string): string => {
  return withBasePath(`/fonts/${filename}`);
};

/**
 * 영상 경로 생성 헬퍼
 */
export const getVideoPath = (filename: string): string => {
  return withBasePath(`/videos/${filename}`);
};
