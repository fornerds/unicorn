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
    <html lang="ko" className={`${cardo.variable} ${elice.variable}`}>
      <body className="font-suit">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
