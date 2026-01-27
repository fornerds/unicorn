/**
 * 정적 assets 경로를 관리하는 유틸리티
 */

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
  return `/images/${filename}`;
};

/**
 * 아이콘 경로 생성 헬퍼
 */
export const getIconPath = (filename: string): string => {
  return `/icons/${filename}`;
};

/**
 * 폰트 경로 생성 헬퍼
 */
export const getFontPath = (filename: string): string => {
  return `/fonts/${filename}`;
};

/**
 * 영상 경로 생성 헬퍼
 */
export const getVideoPath = (filename: string): string => {
  return `/videos/${filename}`;
};
