import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '주문/결제',
  description: '주문 정보를 확인하고 결제를 진행하세요.',
  robots: { index: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
