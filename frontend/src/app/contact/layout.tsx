import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: '유니콘에 문의사항이 있으신가요? 언제든지 연락해 주세요.',
  openGraph: {
    title: 'Contact | UNICORN',
    description: '유니콘에 문의사항이 있으신가요? 언제든지 연락해 주세요.',
  },
  twitter: {
    title: 'Contact | UNICORN',
    description: '유니콘에 문의사항이 있으신가요? 언제든지 연락해 주세요.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
