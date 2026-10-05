import type { Metadata, Viewport } from 'next';
import SiteLayout from '@/components/site-layout';
import { brandIcons, brandViewport } from '@/lib/brand-icons';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://supermetal-sa.com'),
  title: 'Super Metal Trading | Demolition, Scrap & Equipment Rental',
  description: 'Super Metal Trading Company. Demolition, dismantling, site preparation, scrap trading and heavy equipment rental in Saudi Arabia.',
  ...brandIcons,
  alternates: { canonical: '/en/', languages: { ar: '/', en: '/en/', 'x-default': '/' } },
};

export const viewport: Viewport = brandViewport;

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="en">{children}</SiteLayout>;
}
