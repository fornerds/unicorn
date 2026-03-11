import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '찜 목록',
  description: '내가 찜한 제품 목록을 확인하세요.',
  robots: { index: false },
};

export default function MyLikesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
