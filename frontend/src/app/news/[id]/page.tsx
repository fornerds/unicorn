import NewsDetailClient from './NewsDetailClient';

export async function generateStaticParams() {
  return [];
}

export default function NewsDetailPage() {
  return <NewsDetailClient />;
}
