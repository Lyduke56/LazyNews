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
  metadataBase: new URL('https://lazynews.lyduke.com'),
  title: {
    default: 'LazyNews | Your Curated Banger Headlines',
    template: '%s | LazyNews',
  },
  description: 'LazyNews is a customized news scraper bringing you curated high-impact banger headlines and summarized updates based on your preferences.',
  openGraph: {
    title: 'LazyNews | Your Curated Banger Headlines',
    description: 'Customized news scraper delivering top-tier banger headlines.',
    url: 'https://lazynews.lyduke.com', // Placeholder URL
    siteName: 'LazyNews',
    images: [
      {
        url: '/card-bg.jpg', // Placeholder OG image
        width: 1200,
        height: 630,
        alt: 'LazyNews OpenGraph Image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LazyNews | Your Curated Banger Headlines',
    description: 'Customized news scraper delivering top-tier banger headlines.',
    images: ['/card-bg.jpg'],
  },
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
