import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Blog – Home Decor & Lifestyle',
  description:
    'Explore home decor tips, interior styling inspiration, and the latest updates from Coffr – your go-to destination for premium home furnishings.',
  keywords: [
    'home decor blog',
    'interior design tips',
    'Coffr furniture',
    'lifestyle blog',
    'home styling inspiration',
  ],
  authors: [{ name: 'Coffr Team', url: 'https://coffr.com' }],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/store/blog',
  },
  openGraph: {
    title: 'Blog – Home Decor & Lifestyle',
    description: 'Explore home decor tips, interior styling inspiration, and the latest updates from Coffr.',
    url: '/store/blog',
    siteName: 'Coffr',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog – Home Decor & Lifestyle',
    description: 'Tips, inspiration, and stories from the Coffr team.',
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return children;
}
