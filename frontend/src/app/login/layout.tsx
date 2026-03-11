import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
  description: '유니콘 계정으로 로그인하세요.',
  openGraph: {
    title: '로그인 | UNICORN',
    description: '유니콘 계정으로 로그인하세요.',
  },
  twitter: {
    title: '로그인 | UNICORN',
    description: '유니콘 계정으로 로그인하세요.',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
