import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="sk">
      <body>{children}</body>
    </html>
  );
}
