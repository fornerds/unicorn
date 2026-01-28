import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Tailwind Preflight가 기본 배경색을 설정하지 않도록 확인
  corePlugins: {
    preflight: true, // Preflight는 유지하되, CSS로 오버라이드
  },
  theme: {
    extend: {
      screens: {
        '3xl': '1840px',
      },
      colors: {
        primary: {
          DEFAULT: '#your-primary-color',
          light: '#your-primary-light',
          dark: '#your-primary-dark',
        },
      },
      fontFamily: {
        sans: ['SUIT', 'var(--font-suit)', 'sans-serif'],
        elice: ['EliceDXNeolliOTF', 'sans-serif'],
        suit: ['SUIT', 'sans-serif'],
        cardo: ['var(--font-cardo)', 'serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      animationPlayState: {
        paused: 'paused',
        running: 'running',
      },
    },
  },
  plugins: [],
};

export default config;
