import { notFound } from 'next/navigation';
import { ProductDetailClient } from './ProductDetailClient';

export async function generateStaticParams() {
  // 제품 ID 목록 (실제로는 API에서 가져와야 함)
  return [{ id: '1' }];
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  // 제품이 존재하지 않으면 404
  if (productId !== '1') {
    notFound();
  }

  return <ProductDetailClient />;
}
