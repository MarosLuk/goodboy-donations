import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/query/QueryProvider';
import { StyleProvider } from '@/styles/StyleProvider';

const inter = Inter({
  // latin-ext carries the Slovak diacritics.
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GoodBoy Foundation',
  description: 'Support Slovak dog shelters with a donation to the GoodBoy Foundation.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className={inter.variable}>
      <body>
        <StyleProvider>
          <QueryProvider>{children}</QueryProvider>
        </StyleProvider>
      </body>
    </html>
  );
}
