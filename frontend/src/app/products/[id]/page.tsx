import { ProductDetailClient } from './ProductDetailClient';

export async function generateStaticParams() {
  return [];
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient id={params.id} />;
}
