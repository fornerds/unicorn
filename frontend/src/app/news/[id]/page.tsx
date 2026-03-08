import NewsDetailClient from './NewsDetailClient';

export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:18080/api/v1';
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
