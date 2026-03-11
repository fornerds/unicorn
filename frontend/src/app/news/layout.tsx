import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News',
  description: '유니콘의 최신 소식과 업계 뉴스를 확인하세요.',
  openGraph: {
    title: 'News | UNICORN',
    description: '유니콘의 최신 소식과 업계 뉴스를 확인하세요.',
  },
  twitter: {
    title: 'News | UNICORN',
    description: '유니콘의 최신 소식과 업계 뉴스를 확인하세요.',
  },
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
