import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fetchPlatformPolicies } from '@/lib/api';
import ScannerStudio from '@/components/ScannerStudio';
import {
  BookOpen,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';

interface PageProps {
  params: {
    platform: string;
    industry: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const title = `${params.platform.toUpperCase()} ${params.industry.replace('-', ' ')} Ad & Content Policy (2026)`;
  const description = `Complete 2026 guidelines on running ads and posting content in ${params.industry} on ${params.platform}. Prohibited terms, disclaimers, and approval tips.`;

  return {
    title,
    description,
  };
}

export default async function IndustryPolicyPage({ params }: PageProps) {
  const { platform, industry } = params;
  const policies = await fetchPlatformPolicies(platform);
  const policy = policies.find((p) => p.slug === industry.toLowerCase()) || policies[0];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-slate-300">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/policies" className="hover:text-slate-300">Policies</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-purple-400 capitalize">{platform}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-300 capitalize">{industry.replace('-', ' ')}</span>
      </nav>

      {/* Hero */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-purple-950 text-purple-300 border border-purple-800">
            {platform.toUpperCase()} Policy Review 2026
          </span>
          {policy?.officialPolicyUrl && (
            <a
              href={policy.officialPolicyUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-purple-400 hover:underline flex items-center gap-1"
            >
              Official Documentation <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {policy?.title || `${platform.toUpperCase()} Policy for ${industry.replace('-', ' ')}`}
        </h1>

        <p className="text-base text-slate-300 leading-relaxed max-w-4xl">
          {policy?.summary || 'Review platform compliance rules before running paid advertising campaigns.'}
        </p>

        {policy && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3">
              <h3 className="text-xs font-bold uppercase text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Prohibited Practices
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {policy.prohibitedPractices.map((p, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold">✕</span> {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
              <h3 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Approval Tips & Best Practices
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {policy.algoSafeTips.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Embedded Scanner */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white">Scan Your Script or Ad Copy for This Policy</h2>
          <p className="text-slate-400 text-sm mt-1">
            Ensure your text contains zero violations before submitting for review.
          </p>
        </div>
        <ScannerStudio />
      </div>
    </div>
  );
}
