'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { translate, type Locale } from '@/lib/messages';

const LanguageContext = createContext<Locale>('ar');

export function LanguageProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LanguageContext.Provider value={locale}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const locale = useContext(LanguageContext);
  return useMemo(() => ({ locale, t: (value: string) => translate(locale, value) }), [locale]);
}

export function LanguageSwitch() {
  const { locale } = useLanguage();
  const target = locale === 'ar' ? 'en' : 'ar';
  return <a className="language-switch" href={target === 'en' ? '/en/' : '/'} hrefLang={target} lang={target}
    aria-label={target === 'en' ? 'Switch to English' : 'التبديل إلى العربية'}
    onClick={event => { event.currentTarget.hash = window.location.hash; }}>
    {target === 'en' ? 'English' : 'العربية'}
  </a>;
}
