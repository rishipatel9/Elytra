import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Manrope } from 'next/font/google';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Elytra',
  description: 'AI career guidance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} `}>{children}</body>
    </html>
  );
}
