import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '주문 내역',
  description: '나의 주문 내역을 확인하세요.',
  robots: { index: false },
};

export default function MyOrdersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
