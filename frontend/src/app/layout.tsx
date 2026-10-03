import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'ScriptSentinel - Algorithmic Compliance & Shadowban Scanner 2026',
  description:
    'Scan video scripts, ad copy, and landing pages against platform-specific shadowban triggers on TikTok, YouTube, Meta, and Google Ads. Instant algo-safe suggestions.',
  keywords: [
    'shadowban scanner',
    'tiktok banned words',
    'youtube demonetization checker',
    'facebook ad compliance',
    'algo-safe script rewrite',
    'marketing compliance scanner',
  ],
  authors: [{ name: 'ScriptSentinel' }],
  openGraph: {
    title: 'ScriptSentinel - Algorithmic Compliance & Shadowban Scanner',
    description:
      'Prevent shadowbans, reach suppression, and ad rejections with real-time algorithm compliance intelligence.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ScriptSentinel',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
    },
    description:
      'Algorithmic compliance, shadowban prevention, and ad policy scanning tool for content creators and marketers.',
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
