'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ProfileIcon, CartIcon } from '@/components/ui/icons';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { useHeader } from '@/contexts/HeaderContext';
import { useAuthStore } from '@/stores/authStore';
import { LoginModal } from '@/components/ui/LoginModal';

interface HeaderProps {
  variant?: 'main' | 'default';
}

const navigationItems = [
  { label: 'Products', href: ROUTES.PRODUCTS },
  { label: 'Company', href: ROUTES.ABOUT },
  { label: 'Contact', href: ROUTES.CONTACT },
  { label: 'News', href: ROUTES.NEWS },
];

export const Header = ({ variant = 'default' }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { isFirstSection, introOverlayVisible } = useHeader();
  const { isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // basePath를 고려한 경로 비교 (GitHub Pages: /unicorn)
  const normalizedPath = pathname.replace(/^\/unicorn\/?/, '') || '/';
  const normalizedPathClean = normalizedPath.replace(/\/$/, '') || '/';
  const isHomePage = normalizedPathClean === ROUTES.HOME || normalizedPathClean === '/' || pathname === '/unicorn' || pathname === '/unicorn/';
  const isAboutPage = normalizedPathClean === ROUTES.ABOUT || normalizedPathClean === '/about';
  const isContactPage = normalizedPathClean === ROUTES.CONTACT || normalizedPathClean === '/contact';

  const effectiveFirstSection = (isAboutPage || isContactPage)
    ? (isFirstSection !== undefined ? isFirstSection : true)
    : isFirstSection;

  const isTransparent = (isHomePage || isAboutPage || isContactPage) && effectiveFirstSection;

  const textColor = (isAboutPage || isContactPage) ? 'text-[#1F2937]' : (isTransparent ? 'text-white' : 'text-[#374151]');

  const shouldBeTransparent = isTransparent || ((isAboutPage || isContactPage) && effectiveFirstSection);

  const iconColor = (isAboutPage || isContactPage) ? '#1F2937' : (isTransparent ? '#ffffff' : '#374151');

  const headerStyle = shouldBeTransparent
    ? { backgroundColor: 'transparent', background: 'transparent' }
    : { backgroundColor: 'white', background: 'white' };

  const headerRef = useRef<HTMLElement>(null);

  // 투명할 때 DOM에 직접 스타일 적용 (CSS 우선순위 문제 해결)
  useEffect(() => {
    if (!headerRef.current) return;

    const updateHeader = () => {
      const header = headerRef.current;
      if (!header) return;

      header.classList.remove('bg-white');

      if (shouldBeTransparent) {
        header.style.setProperty('background-color', 'transparent', 'important');
        header.style.setProperty('background', 'transparent', 'important');
      } else {
        header.style.setProperty('background-color', 'white', 'important');
        header.style.setProperty('background', 'white', 'important');
      }
    };

    updateHeader();
    requestAnimationFrame(updateHeader);
  }, [shouldBeTransparent]);

  // MutationObserver로 bg-white 클래스 추가 감지 및 제거 (about/contact 페이지)
  useEffect(() => {
    if (!headerRef.current) return;
    if (!isAboutPage && !isContactPage) return;
    if (!shouldBeTransparent) return;

    const header = headerRef.current;

    const checkAndRemove = () => {
      if (header.classList.contains('bg-white')) {
        header.classList.remove('bg-white');
        header.style.setProperty('background-color', 'transparent', 'important');
        header.style.setProperty('background', 'transparent', 'important');
      }
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          checkAndRemove();
        }
      });
    });

    observer.observe(header, { attributes: true, attributeFilter: ['class'] });
    const intervalId = setInterval(checkAndRemove, 100);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [isAboutPage, isContactPage, shouldBeTransparent]);

  return (
    <>
    <LoginModal
      isOpen={showLoginModal}
      onClose={() => setShowLoginModal(false)}
      message={'회원만 이용 가능한 서비스입니다.\n로그인하시겠습니까?'}
    />
    <header
      ref={headerRef}
      className={cn(
        'flex items-center justify-between px-[60px] py-[20px] w-full transition-colors duration-300 sticky top-0 z-50',
      )}
      style={{
        ...headerStyle,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        ...(shouldBeTransparent
          ? { backgroundColor: 'transparent', background: 'transparent' }
          : { backgroundColor: 'white', background: 'white' }
        ),
      }}
    >
      {/* Logo */}
      <motion.div
        className="flex items-center justify-center p-[10px] shrink-0"
        initial={false}
        animate={{ opacity: introOverlayVisible ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <Link href={ROUTES.HOME} className="flex items-center">
          <span
            className={cn(
              'font-cardo text-[32px] leading-[normal] whitespace-nowrap',
              textColor,
            )}
          >
            UNICORN
          </span>
        </Link>
      </motion.div>

      {/* Navigation + Icons */}
      <motion.div
        className="flex gap-[175px] items-center shrink-0"
        initial={false}
        animate={{ opacity: introOverlayVisible ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
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
          <button
            onClick={() => {
              if (!isAuthenticated) { setShowLoginModal(true); return; }
              router.push(ROUTES.MY_PAGE);
            }}
            className="relative shrink-0 w-[28px] h-[28px] flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="프로필"
          >
            <ProfileIcon className="w-[28px] h-[28px]" fill={iconColor} />
          </button>
          <button
            onClick={() => {
              if (!isAuthenticated) { setShowLoginModal(true); return; }
              router.push(ROUTES.CART);
            }}
            className="relative shrink-0 w-[28px] h-[28px] flex items-center justify-center hover:opacity-80 transition-opacity"
            aria-label="장바구니"
          >
            <CartIcon className="w-[28px] h-[28px]" fill={iconColor} />
          </button>
        </div>
      </motion.div>
    </header>
    </>
  );
};
