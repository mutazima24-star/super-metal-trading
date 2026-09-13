import { LanguageProvider } from '@/components/language';
import type { Locale } from '@/lib/messages';
import type { ReactNode } from 'react';

export default function SiteLayout({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
    <body className="antialiased"><LanguageProvider locale={locale}>{children}</LanguageProvider></body>
  </html>;
}
