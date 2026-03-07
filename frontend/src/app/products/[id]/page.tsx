import { ProductDetailClient } from './ProductDetailClient';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient id={params.id} />;
}
