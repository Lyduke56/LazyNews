import type { Metadata } from 'next';
import { IBM_Plex_Serif, Inika } from 'next/font/google';
import './globals.css';

const ibm = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm',
});

const inika = Inika({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inika',
});

export const metadata: Metadata = {
  title: 'Lazynews',
  description: 'A customized news scraper',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibm.variable} ${inika.variable}`}>
      <body>{children}</body>
    </html>
  );
}
