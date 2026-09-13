import type { Metadata } from 'next';
import SiteLayout from '@/components/site-layout';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://supermetal-sa.com'),
  title: 'Super Metal Trading | Demolition, Scrap & Equipment Rental',
  description: 'Super Metal Trading Company. Demolition, dismantling, site preparation, scrap trading and heavy equipment rental in Saudi Arabia.',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  alternates: { canonical: '/en/', languages: { ar: '/', en: '/en/', 'x-default': '/' } },
};

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="en">{children}</SiteLayout>;
}
