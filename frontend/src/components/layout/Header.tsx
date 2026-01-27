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

  const isHomePage = pathname === ROUTES.HOME;
  const isAboutPage = pathname === ROUTES.ABOUT;
  
  // 홈페이지에서만 isFirstSection을 사용 (about 페이지와 분리)
  const isTransparent = isHomePage && isFirstSection;

  const textColor = isTransparent ? 'text-white' : isAboutPage ? 'text-[#1f2937]' : 'text-[#374151]';
  
  // bgColor 결정 로직: 홈페이지와 about 페이지를 명확히 분리
  let bgColor = 'bg-white';
  if (isTransparent) {
    // 홈페이지에서 첫 섹션일 때 투명
    bgColor = 'bg-transparent';
  } else if (isAboutPage) {
    // about 페이지: 항상 흰색 배경
    bgColor = 'bg-white';
  }
  
  const iconColor = isTransparent ? '#ffffff' : isAboutPage ? '#1f2937' : '#374151';

  const shouldShowAnimation = showInitialAnimation && isFirstSection;

  return (
    <>
      <header
        className={cn(
          'flex items-center justify-between px-[60px] py-[20px] w-full transition-colors duration-300 sticky top-0 z-50',
          bgColor
        )}
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
