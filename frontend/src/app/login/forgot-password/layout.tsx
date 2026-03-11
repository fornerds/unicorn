import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '비밀번호 찾기',
  description: '유니콘 계정 비밀번호를 재설정하세요.',
  robots: { index: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
