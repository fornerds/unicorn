import type { Metadata } from 'next';
import NewsDetailClient from './NewsDetailClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:18080/api/v1';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  try {
    const res = await fetch(`${API_URL}/news/${params.id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error();
    const json = await res.json();
    const news = json?.data;
    const title = news?.title ?? '뉴스 상세';
    const description = news?.content
      ? news.content.replace(/<[^>]+>/g, '').slice(0, 120)
      : `${title} - 유니콘 뉴스`;
    const image = news?.imageUrl?.startsWith('http') ? news.imageUrl : undefined;
    return {
      title,
      description,
      openGraph: {
        type: 'article',
        title: `${title} | UNICORN`,
        description,
        ...(image && { images: [{ url: image, width: 1200, height: 630, alt: title }] }),
        ...(news?.publishedAt && { publishedTime: news.publishedAt }),
      },
      twitter: {
        title: `${title} | UNICORN`,
        description,
        ...(image && { images: [image] }),
      },
    };
  } catch {
    return { title: '뉴스 상세' };
  }
}

export async function generateStaticParams() {
  try {
    const apiUrl = API_URL;
    const res = await fetch(`${apiUrl}/news?limit=100`);
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

export default function NewsDetailPage() {
  return <NewsDetailClient />;
}
