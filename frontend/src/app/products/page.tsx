import { Suspense } from 'react';
import { ProductsContent } from './ProductsContent';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="font-suit font-medium text-[18px] text-[#959ba9]">로딩 중...</p>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
