import './globals.css';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Investor Intelligence | 6-Pillar IPO Reality Scores & Stock Screener',
    template: '%s | Investor Intelligence',
  },
  description:
    'Institutional-grade IPO research, 6-pillar reality scoring engine, real-time Grey Market Premium (GMP), multi-cap stock screener, and AI prospectus copilot.',
  keywords: [
    'IPO research',
    'IPO reality score',
    'Stock screener',
    'Grey market premium GMP',
    'SEBI DRHP analysis',
    'Portfolio tracker',
    'Investment thesis',
    'Fintech',
  ],
  authors: [{ name: 'Investor Intelligence Research Desk' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#030712',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#030712] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
