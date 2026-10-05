import type { Metadata, Viewport } from 'next';

// Shared favicon / app-icon wiring for both root layouts (ar and en route groups).
// Files live in public/ so they are served from the site root in the exported site.
export const brandIcons: Pick<Metadata, 'icons' | 'manifest'> = {
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const brandViewport: Viewport = {
  themeColor: '#1e324a',
};
