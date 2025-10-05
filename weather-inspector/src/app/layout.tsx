import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@/styles/weather-figma.css'; // NEW: Import weather-figma.css
import { ThemeProvider } from '@/lib/theme'; // Only import ThemeProvider
import LayoutContent from '@/components/layout-content'; // Import LayoutContent

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Inspector Weather',
  description: 'A minimal weather app with a secret.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <ThemeProvider><LayoutContent>{children}</LayoutContent></ThemeProvider>
    </html>
  );
}