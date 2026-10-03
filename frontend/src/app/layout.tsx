import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuroraVeilCanvas from '@/components/AuroraVeilCanvas';
import AuthModal from '@/components/AuthModal';
import { AuthProvider } from '@/lib/AuthContext';

export const metadata: Metadata = {
  title: 'ScriptSentinel - AI Algorithmic Compliance & Shadowban Scanner',
  description:
    'Real-time AI script scanning, video transcription, and compliance intelligence across TikTok, YouTube, Meta, and Google Ads. Prevent shadowbans with 1-click safe rewrites.',
  keywords: [
    'shadowban scanner',
    'tiktok banned words',
    'video transcription shadowban',
    'youtube demonetization checker',
    'facebook ad compliance',
    'algo-safe script rewrite',
    'marketing compliance AI',
  ],
  openGraph: {
    title: 'ScriptSentinel - AI Algorithmic Compliance & Shadowban Scanner',
    description:
      'Prevent shadowbans, reach suppression, and ad rejections with real-time AI compliance intelligence.',
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
      'AI Algorithmic compliance, video transcription, and ad policy scanning tool for content creators and marketers.',
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#04060d] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-slate-950 relative overflow-x-hidden font-sans">
        <AuthProvider>
          <AuroraVeilCanvas />
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
          <AuthModal />
        </AuthProvider>
      </body>
    </html>
  );
}
