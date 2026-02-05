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

  const normalizedPath = pathname.replace(/^\/unicorn\/?/, '') || '/';
  const isHomePage = mounted && (normalizedPath === ROUTES.HOME || normalizedPath === '/' || pathname === '/unicorn' || pathname === '/unicorn/');

  useEffect(() => {
    if (mounted) {
      if (!isHomePage) {
        // 다른 페이지에서는 body가 스크롤 가능해야 sticky가 작동함
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.overflowY = 'auto';
        document.documentElement.style.overflowY = 'auto';
      }
    }
  }, [mounted, isHomePage, pathname]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.overflowY = '';
      document.documentElement.style.overflowY = '';
    };
  }, []);

  return (
    <HeaderProvider>
      <div style={{ display: 'contents' }}>
        <Header />
        <div className="flex flex-col min-h-screen" style={{ overflow: 'visible' }}>
          <main className="flex-1" style={{ overflow: 'visible' }}>
            {children}
          </main>
          {!isHomePage && <Footer />}
        </div>
      </div>
    </HeaderProvider>
  );
};
