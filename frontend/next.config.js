/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // GitHub Pages 배포를 위한 설정
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
  trailingSlash: true,
  
  // HMR 최적화 설정
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 개발 모드에서 HMR 성능 최적화
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  
  // 이미지 최적화 설정
  images: {
    domains: [],
    formats: ['image/avif', 'image/webp'],
    // 정적 이미지 최적화 (GitHub Pages는 unoptimized 필요)
    unoptimized: true,
  },
  
  // 정적 파일 캐싱 설정 (정적 export에서는 headers 사용 불가)
  // GitHub Pages는 .htaccess나 _headers 파일로 캐싱 설정 가능
};

module.exports = nextConfig;
