import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "المعدن الفائق التجارية | الهدم، السكراب وتأجير المعدات",
  description: "شركة المعدن الفائق التجارية. خدمات الهدم والتفكيك وتجهيز المواقع، تجارة السكراب وتأجير المعدات الثقيلة في المملكة العربية السعودية.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">{children}</body>
    </html>
  );
}
