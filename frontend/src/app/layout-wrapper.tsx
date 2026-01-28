'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeaderProvider } from '@/contexts/HeaderContext';
import { ROUTES } from '@/utils/constants';

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // basePath를 고려한 경로 비교 (GitHub Pages: /unicorn)
  const normalizedPath = pathname.replace(/^\/unicorn\/?/, '') || '/';
  const isHomePage = mounted && (normalizedPath === ROUTES.HOME || normalizedPath === '/' || pathname === '/unicorn' || pathname === '/unicorn/');

  // 메인 페이지가 아닐 때 body overflow 복원 (메인 페이지에서 다른 페이지로 이동한 경우)
  useEffect(() => {
    if (mounted && !isHomePage) {
      // body 스크롤 복원
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [mounted, isHomePage]);

  return (
    <HeaderProvider>
      <Header />
      {children}
      {!isHomePage && <Footer />}
    </HeaderProvider>
  );
};
