import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '気仙沼デジタル体験 | Kesennuma Digital Experiences',
  description: '3D地図で巡る気仙沼の記憶と体験。震災の記憶、漁業の文化、日常の喜びを共有するプラットフォーム。',
  keywords: ['気仙沼', 'Kesennuma', '3D地図', 'デジタルアーカイブ', '震災の記憶', '漁業'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
