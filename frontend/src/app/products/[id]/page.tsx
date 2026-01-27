import { notFound } from 'next/navigation';
import { ProductDetailClient } from './ProductDetailClient';

export async function generateStaticParams() {
  // 제품 ID 목록 (실제로는 API에서 가져와야 함)
  // ProductsContent.tsx의 mockProducts와 동기화 필요
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    { id: '11' },
  ];
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const productId = params.id;

  // 제품이 존재하지 않으면 404
  const validProductIds = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
  if (!validProductIds.includes(productId)) {
    notFound();
  }

  return <ProductDetailClient />;
}
