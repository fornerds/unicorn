'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProfileIcon, CartIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { useHeader } from '@/contexts/HeaderContext';
import { useScroll } from 'framer-motion';

interface HeaderProps {
  variant?: 'main' | 'default';
}

const navigationItems = [
  { label: 'Products', href: ROUTES.PRODUCTS },
  { label: 'Company', href: ROUTES.ABOUT },
  { label: 'Contact', href: '#' },
  { label: 'News', href: ROUTES.NEWS },
];

export const Header = ({ variant = 'default' }: HeaderProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const { isFirstSection, showInitialAnimation, setLogoAnimationComplete } = useHeader();
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (showInitialAnimation && isFirstSection) {
      // 첫 진입 시 로고 애니메이션 시작
      setAnimationComplete(false);
      setAnimationStarted(true);
      setLogoAnimationComplete(false); // 초기화
      const timer = setTimeout(() => {
        setAnimationComplete(true);
        setLogoAnimationComplete(true); // 2초 후 완료
      }, 2000);
      return () => clearTimeout(timer);
    } else if (!showInitialAnimation && isFirstSection) {
      // 첫 진입이 아닌 경우 즉시 완료 상태로 설정
      setAnimationComplete(true);
      setAnimationStarted(false);
      setLogoAnimationComplete(true);
    } else if (!isFirstSection) {
      setAnimationComplete(true);
      setAnimationStarted(false);
    }
  }, [showInitialAnimation, isFirstSection, setLogoAnimationComplete]);

  // basePath를 고려한 경로 비교 (GitHub Pages: /unicorn)
  // /unicorn 또는 /unicorn/로 시작하는 경우 제거
  const normalizedPath = pathname.replace(/^\/unicorn\/?/, '') || '/';
  const isHomePage = normalizedPath === ROUTES.HOME || normalizedPath === '/' || pathname === '/unicorn' || pathname === '/unicorn/';
  const isAboutPage = normalizedPath === ROUTES.ABOUT;
  
  // 홈페이지에서만 isFirstSection을 사용 (about 페이지와 분리)
  // mounted 조건 제거: 초기 렌더링 시에도 투명하게 표시
  const isTransparent = isHomePage && isFirstSection;
  
  // 디버깅용 로그 (개발 환경에서만)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Header Debug:', {
        pathname,
        normalizedPath,
        isHomePage,
        isFirstSection,
        isTransparent,
        bgColor,
      });
    }
  }, [pathname, normalizedPath, isHomePage, isFirstSection, isTransparent]);

  const textColor = isTransparent ? 'text-white' : isAboutPage ? 'text-[#1f2937]' : 'text-[#374151]';
  
  // bgColor 결정 로직: 홈페이지와 about 페이지를 명확히 분리
  // 투명일 때는 bgColor 클래스를 사용하지 않고 인라인 스타일만 사용
  let bgColor = 'bg-white';
  if (isAboutPage) {
    // about 페이지: 항상 흰색 배경
    bgColor = 'bg-white';
  }
  // isTransparent일 때는 bgColor를 설정하지 않음 (인라인 스타일로 처리)
  
  const iconColor = isTransparent ? '#ffffff' : isAboutPage ? '#1f2937' : '#374151';
  
  // 투명 배경일 때 명시적으로 배경색 설정 (인라인 스타일이 CSS 클래스보다 우선순위가 높음)
  const headerStyle = isTransparent 
    ? { 
        backgroundColor: 'transparent',
        background: 'transparent',
      } 
    : {};

  const shouldShowAnimation = showInitialAnimation && isFirstSection;
  
  // 디버깅용 로그 (개발 환경에서만)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Header Debug:', {
        pathname,
        normalizedPath,
        isHomePage,
        isFirstSection,
        isTransparent,
        bgColor,
        headerStyle,
      });
    }
  }, [pathname, normalizedPath, isHomePage, isFirstSection, isTransparent, bgColor, headerStyle]);

  return (
    <>
      <header
        className={cn(
          'flex items-center justify-between px-[60px] py-[20px] w-full transition-colors duration-300 sticky top-0 z-50',
          bgColor
        )}
        style={headerStyle}
      >
        <div className="flex items-center justify-center p-[10px] shrink-0">
          <Link href={ROUTES.HOME} className="flex items-center">
            <span
              className={cn(
                'font-cardo leading-[normal] whitespace-nowrap transition-all duration-[2000ms] ease-in-out',
                shouldShowAnimation && !animationComplete ? 'text-white' : textColor
              )}
              style={{
                position: shouldShowAnimation ? 'fixed' : 'relative',
                top: shouldShowAnimation
                  ? animationComplete
                    ? '20px'
                    : '50%'
                  : 'auto',
                left: shouldShowAnimation
                  ? animationComplete
                    ? '70px'
                    : '50%'
                  : 'auto',
                transform: shouldShowAnimation
                  ? animationComplete
                    ? 'translate(0, 0)'
                    : 'translate(-50%, -50%)'
                  : 'translate(0, 0)',
                fontSize: shouldShowAnimation
                  ? animationComplete
                    ? '32px'
                    : '128px'
                  : '32px',
                zIndex: shouldShowAnimation ? 60 : 'auto',
              }}
            >
              UNICORN
            </span>
          </Link>
        </div>

      <div className="flex gap-[175px] items-center shrink-0">
        <nav className="flex gap-[101px] items-center shrink-0">
          {navigationItems.map((item) => {
            const isActive = mounted && pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center justify-center p-[10px] shrink-0',
                  'font-suit font-medium text-[20px] leading-[normal] whitespace-nowrap',
                  'hover:opacity-80 transition-opacity transition-colors duration-300',
                  textColor
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-[30px] h-[44px] items-center justify-center shrink-0">
          <Link
            href={ROUTES.MY_PAGE}
            className="relative shrink-0 w-[28px] h-[28px] flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="프로필"
          >
            <ProfileIcon className="w-[28px] h-[28px]" fill={iconColor} />
          </Link>
          <Link
            href={ROUTES.CART}
            className="relative shrink-0 w-[28px] h-[28px] flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="장바구니"
          >
            <CartIcon className="w-[28px] h-[28px]" fill={iconColor} />
          </Link>
        </div>
      </div>
    </header>
    </>
  );
};
