import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 완료',
  description: '유니콘 회원가입이 완료되었습니다.',
  robots: { index: false },
};

export default function SignupCompleteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
