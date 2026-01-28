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

  const isHomePage = mounted && pathname === ROUTES.HOME;

  return (
    <HeaderProvider>
      <div style={{ backgroundColor: 'transparent', background: 'transparent' }}>
        <Header />
        {children}
        {!isHomePage && <Footer />}
      </div>
    </HeaderProvider>
  );
};
