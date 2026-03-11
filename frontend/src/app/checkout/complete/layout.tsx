import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '주문 완료',
  description: '주문이 완료되었습니다. 감사합니다.',
  robots: { index: false },
};

export default function CheckoutCompleteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
