import type { Metadata } from 'next';
import SiteLayout from '@/components/site-layout';
import '../globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://supermetal-sa.com'),
  title: 'المعدن الفائق التجارية | الهدم، السكراب وتأجير المعدات',
  description: 'شركة المعدن الفائق التجارية. خدمات الهدم والتفكيك وتجهيز المواقع، تجارة السكراب وتأجير المعدات الثقيلة في المملكة العربية السعودية.',
  icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
  alternates: { canonical: '/', languages: { ar: '/', en: '/en/', 'x-default': '/' } },
};

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="ar">{children}</SiteLayout>;
}
