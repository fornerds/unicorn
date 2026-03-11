import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '비밀번호 재설정',
  description: '새로운 비밀번호를 설정하세요.',
  robots: { index: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
