import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProductsContent } from './ProductsContent';

export const metadata: Metadata = {
  title: 'Products',
  description: '유니콘의 다양한 모빌리티 제품을 만나보세요.',
  openGraph: {
    title: 'Products | UNICORN',
    description: '유니콘의 다양한 모빌리티 제품을 만나보세요.',
  },
  twitter: {
    title: 'Products | UNICORN',
    description: '유니콘의 다양한 모빌리티 제품을 만나보세요.',
  },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="font-suit font-normal text-[18px] text-[#959ba9]">로딩 중...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
