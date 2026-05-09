import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '強悍割草班 | 台東割草整地鋸樹工程承攬',
  description: '再硬的草,交給強悍。台東在地 8 人專業團隊,提供割草、整地、鋸樹、工程承攬服務。免費估價,服務台東縣全區。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
