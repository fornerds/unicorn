import type { Metadata } from 'next';
import { Cardo } from 'next/font/google';
import localFont from 'next/font/local';
import '../styles/globals.css';
import { Providers } from './providers';
import { LayoutWrapper } from './layout-wrapper';

const cardo = Cardo({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cardo',
  display: 'swap',
});

const elice = localFont({
  src: [
    {
      path: '../../public/fonts/EliceDXNeolliOTF-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/EliceDXNeolliOTF-Medium.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/EliceDXNeolliOTF-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-elice',
  display: 'swap',
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://unicorn.co.kr';
const OG_IMAGE = `${BASE_URL}/og/og-default.png`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'UNICORN',
    template: '%s | UNICORN',
  },
  description: '유니콘의 차세대 모빌리티 솔루션을 만나보세요.',
  keywords: ['유니콘', 'UNICORN', '모빌리티', '전동킥보드', '전동휠체어'],
  openGraph: {
    type: 'website',
    siteName: 'UNICORN',
    title: 'UNICORN',
    description: '유니콘의 차세대 모빌리티 솔루션을 만나보세요.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'UNICORN' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNICORN',
    description: '유니콘의 차세대 모빌리티 솔루션을 만나보세요.',
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicons/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    apple: { url: '/favicons/apple-touch-icon.png', sizes: '180x180' },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${cardo.variable} ${elice.variable}`}>
      <body className="font-suit">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
