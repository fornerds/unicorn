/**
 * 정적 assets 경로를 관리하는 유틸리티
 */

// basePath를 가져오는 헬퍼 함수
const getBasePath = (): string => {
  if (typeof window !== 'undefined') {
    // 클라이언트 사이드: 현재 경로에서 basePath 추출
    const path = window.location.pathname;
    if (path.startsWith('/unicorn')) {
      return '/unicorn';
    }
  }
  // 서버 사이드 또는 basePath가 없는 경우
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
};

/**
 * basePath를 포함한 경로 생성 헬퍼
 */
export const withBasePath = (path: string): string => {
  const basePath = getBasePath();
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
};

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
