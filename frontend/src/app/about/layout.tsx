import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Company',
  description: '유니콘의 비전과 미션, 그리고 우리의 이야기를 소개합니다.',
  openGraph: {
    title: 'Company | UNICORN',
    description: '유니콘의 비전과 미션, 그리고 우리의 이야기를 소개합니다.',
  },
  twitter: {
    title: 'Company | UNICORN',
    description: '유니콘의 비전과 미션, 그리고 우리의 이야기를 소개합니다.',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
