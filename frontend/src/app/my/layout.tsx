import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마이페이지',
  description: '나의 유니콘 계정을 관리하세요.',
  robots: { index: false },
};

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
