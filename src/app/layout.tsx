import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '強悍割草班｜台東割草整地鋸樹',
  description: '台東在地 8 人專業團隊。割草、整地、鋸樹、工程承攬。免費估價、價格公道、做工確實。預約專線 0906-505690。',
  keywords: '台東割草,台東整地,台東鋸樹,台東割草推薦,強悍割草班',
  openGraph: {
    title: '強悍割草班｜再硬的草交給強悍',
    description: '台東在地 8 人專業團隊。割草、整地、鋸樹、工程承攬。',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant-TW">
      <body>{children}</body>
    </html>
  );
}
