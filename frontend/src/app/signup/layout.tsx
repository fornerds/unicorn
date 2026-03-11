import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입',
  description: '유니콘 회원이 되어 다양한 혜택을 누리세요.',
  openGraph: {
    title: '회원가입 | UNICORN',
    description: '유니콘 회원이 되어 다양한 혜택을 누리세요.',
  },
  twitter: {
    title: '회원가입 | UNICORN',
    description: '유니콘 회원이 되어 다양한 혜택을 누리세요.',
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
