import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';

const notoSansJp = Noto_Sans_JP({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode;
};

/**
 * メタデータ
 */
export const metadata: Metadata = {
  title: 'マインスイーパー',
  description: 'Minesweeper',
};

/**
 * 基本レイアウト
 */
export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="ja">
      <body className={notoSansJp.className}>{children}</body>
    </html>
  );
}
