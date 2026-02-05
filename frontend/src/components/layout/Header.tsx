'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
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
  // trailing slash 제거하여 비교
  const normalizedPathClean = normalizedPath.replace(/\/$/, '') || '/';
  const isHomePage = normalizedPathClean === ROUTES.HOME || normalizedPathClean === '/' || pathname === '/unicorn' || pathname === '/unicorn/';
  const isAboutPage = normalizedPathClean === ROUTES.ABOUT || normalizedPathClean === '/about';
  
  // 홈페이지와 about 페이지에서 isFirstSection을 사용하여 헤더 투명도 제어
  // mounted 조건 제거: 초기 렌더링 시에도 투명하게 표시
  // about 페이지에서는 isFirstSection이 true일 때 항상 투명하게 설정
  const isTransparent = (isHomePage || isAboutPage) && isFirstSection;
  
  // 디버깅: about 페이지에서 isTransparent가 false인 경우 확인
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isAboutPage) {
      console.log('About Page Header Debug:', {
        isAboutPage,
        isFirstSection,
        isTransparent,
        calculated: (isHomePage || isAboutPage) && isFirstSection,
      });
    }
  }, [isAboutPage, isFirstSection, isTransparent, isHomePage]);
  
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

  // about 페이지에서는 항상 텍스트 색상을 #1F2937로 설정
  const textColor = isAboutPage ? 'text-[#1F2937]' : (isTransparent ? 'text-white' : 'text-[#374151]');
  
  // bgColor 결정 로직: 홈페이지와 about 페이지를 명확히 분리
  // 투명일 때는 bgColor 클래스를 사용하지 않음 (인라인 스타일로 처리)
  // isTransparent일 때는 항상 빈 문자열 (className에 포함되지 않음)
  // about 페이지에서 isFirstSection이 true일 때도 bg-white를 포함하지 않음
  const shouldBeTransparent = isTransparent || (isAboutPage && isFirstSection);
  const bgColor = shouldBeTransparent ? '' : (isAboutPage ? 'bg-white' : 'bg-white');
  
  // about 페이지에서는 항상 아이콘 색상을 #1F2937로 설정
  const iconColor = isAboutPage ? '#1F2937' : (isTransparent ? '#ffffff' : '#374151');
  
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

  // 헤더 요소에 직접 스타일 적용을 위한 ref
  const headerRef = useRef<HTMLElement>(null);

  // 투명할 때 DOM에 직접 스타일 적용 (CSS 우선순위 문제 해결)
  useEffect(() => {
    if (!headerRef.current) return;
    
    const header = headerRef.current;
    
    if (shouldBeTransparent) {
      // bg-white 클래스가 있다면 제거 (강제로, 여러 번 호출해도 안전)
      header.classList.remove('bg-white');
      // 인라인 스타일로 투명 배경 설정 (클래스보다 우선순위 높음)
      header.style.setProperty('background-color', 'transparent', 'important');
      header.style.setProperty('background', 'transparent', 'important');
    } else {
      // 투명하지 않을 때는 기본 동작
      // 인라인 스타일 제거
      header.style.removeProperty('background-color');
      header.style.removeProperty('background');
      if (isAboutPage) {
        // about 페이지에서 투명하지 않을 때는 흰색 배경
        if (!header.classList.contains('bg-white')) {
          header.classList.add('bg-white');
        }
      } else {
        // 다른 페이지에서는 bg-white 유지
        if (!header.classList.contains('bg-white')) {
          header.classList.add('bg-white');
        }
      }
    }
  }, [shouldBeTransparent, isAboutPage]);
  
  // about 페이지에서 shouldBeTransparent 상태에 따라 헤더 배경 업데이트
  useEffect(() => {
    if (headerRef.current && isAboutPage) {
      if (shouldBeTransparent) {
        // 투명하게 설정
        headerRef.current.classList.remove('bg-white');
        headerRef.current.style.setProperty('background-color', 'transparent', 'important');
        headerRef.current.style.setProperty('background', 'transparent', 'important');
      } else {
        // 흰색 배경으로 설정
        headerRef.current.style.removeProperty('background-color');
        headerRef.current.style.removeProperty('background');
        if (!headerRef.current.classList.contains('bg-white')) {
          headerRef.current.classList.add('bg-white');
        }
      }
    }
  }, [isAboutPage, shouldBeTransparent]);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'flex items-center justify-between px-[60px] py-[20px] w-full transition-colors duration-300 sticky top-0 z-50',
          // shouldBeTransparent일 때는 bgColor를 포함하지 않음
          // about 페이지이고 isFirstSection이 true일 때도 bg-white 제외
          !shouldBeTransparent && bgColor
        )}
        style={{
          ...headerStyle,
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
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
