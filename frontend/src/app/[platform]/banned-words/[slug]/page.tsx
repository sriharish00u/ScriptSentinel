import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchPseoPageData } from '@/lib/api';
import ScannerStudio from '@/components/ScannerStudio';
import {
  ShieldAlert,
  ShieldCheck,
  HelpCircle,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Flame,
} from 'lucide-react';

interface PageProps {
  params: {
    platform: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await fetchPseoPageData(params.slug);
  const title = data?.titleTag || `Is "${params.slug.replace('-', ' ')}" Banned on ${params.platform.toUpperCase()}?`;
  const description = data?.metaDescription || `Detailed compliance analysis on why ${params.slug} is restricted on ${params.platform} algorithms.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function PseoBannedWordPage({ params }: PageProps) {
  const { platform, slug } = params;
  const pageData = await fetchPseoPageData(slug);

  if (!pageData) {
    return (
      <div className="py-24 text-center max-w-xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-white">Topic Directory Page</h2>
        <p className="text-slate-400 text-sm">
          Looking for compliance rules for "{slug.replace('-', ' ')}"? Test it directly in our live studio below.
        </p>
        <div className="pt-8">
          <ScannerStudio />
        </div>
      </div>
    );
  }

  // Generate FAQ Schema for Google Rich Results
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pageData.faqItems.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Schema Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-300">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/database" className="hover:text-slate-300">Banned Words</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-emerald-400 capitalize">{platform}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-300 capitalize">{pageData.targetTerm}</span>
      </nav>

      {/* Top Answer Block (Programmatic SEO Direct Answer) */}
      <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="h-3.5 w-3.5" />
            {platform.toUpperCase()} Algorithm Ruling (2026)
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase ${
              pageData.verdict.includes('Banned')
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
            }`}
          >
            Verdict: {pageData.verdict}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {pageData.h1}
        </h1>

        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed space-y-3">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
            Direct Algorithmic Assessment:
          </span>
          <p>{pageData.explanation}</p>
        </div>

        {/* Safe Alternatives Matrix */}
        {pageData.safeAlternatives.length > 0 && (
          <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Platform Approved Safe Alternatives:
            </h3>
            <div className="flex flex-wrap gap-2">
              {pageData.safeAlternatives.map((alt, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-semibold"
                >
                  ✓ "{alt}"
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* THE HOOK: Immediate Scanner Utility */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Free Script Inspection
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            You Probably Have Other Risky Words In Your Script
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Paste your full video script, ad copy, or caption below to scan against 150+ other restricted triggers.
          </p>
        </div>

        <ScannerStudio />
      </div>

      {/* FAQ Section (SEO Boost) */}
      {pageData.faqItems.length > 0 && (
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-emerald-400" />
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            {pageData.faqItems.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                <h4 className="text-sm font-bold text-white">{item.question}</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
