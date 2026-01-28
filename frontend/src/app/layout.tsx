import type { Metadata } from 'next';
import { Cardo } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';
import { LayoutWrapper } from './layout-wrapper';

const cardo = Cardo({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-cardo',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Unicorn',
  description: 'Unicorn E-commerce Platform',
  icons: {
    icon: '/favicons/favicon.ico',
    apple: '/favicons/apple-touch-icon.png',
  },
  other: {
    'font-suit': 'SUIT',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={cardo.variable} style={{ backgroundColor: 'transparent', background: 'transparent' }}>
      <body className="font-suit" style={{ backgroundColor: 'transparent', background: 'transparent' }}>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
