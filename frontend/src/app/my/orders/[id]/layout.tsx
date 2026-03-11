import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '주문 상세',
  description: '주문 상세 내역을 확인하세요.',
  robots: { index: false },
};

export default function MyOrderDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
