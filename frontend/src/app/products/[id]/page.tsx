import type { Metadata } from 'next';
import { ProductDetailClient } from './ProductDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:18080/api/v1';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/products/${params.id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const product = json?.data;
    const title = product?.name ?? '제품 상세';
    const description = product?.shortDescription ?? `${title} - 유니콘 제품 상세 정보`;
    const image = product?.imageUrl?.startsWith('http') ? product.imageUrl : undefined;
    return {
      title,
      description,
      openGraph: {
        title: `${title} | UNICORN`,
        description,
        ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
      },
      twitter: {
        title: `${title} | UNICORN`,
        description,
        ...(image && { images: [image] }),
      },
    };
  } catch {
    return { title: '제품 상세' };
  }
}

export async function generateStaticParams() {
  try {
    const apiUrl = API_URL;
    const res = await fetch(`${apiUrl}/products?limit=100`);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    const items: { id: number }[] = data?.data?.items ?? [];
    if (items.length > 0) {
      return items.map((item) => ({ id: String(item.id) }));
    }
  } catch {
    // fallback
  }
  return [{ id: '1' }];
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient id={params.id} />;
}
