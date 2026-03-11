import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '프로필 관리',
  description: '회원정보를 확인하고 수정하세요.',
  robots: { index: false },
};

export default function MyProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
