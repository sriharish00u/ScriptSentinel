'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchPlatformPolicies } from '@/lib/api';
import { PlatformPolicyItem } from '@/lib/types';
import {
  BookOpen,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Flame,
  ArrowRight,
} from 'lucide-react';

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<PlatformPolicyItem[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchPlatformPolicies(selectedPlatform);
      setPolicies(data);
      setLoading(false);
    }
    load();
  }, [selectedPlatform]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-4">
          <BookOpen className="h-3.5 w-3.5" />
          Official 2026 Platform Rulebook
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Platform Advertising & <span className="text-purple-400">Content Policies</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Detailed breakdown of prohibited marketing practices, mandatory disclaimers, and algorithmic penalties across TikTok, Meta, YouTube, and Google Ads.
        </p>
      </div>

      {/* Platform Filter */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {['all', 'tiktok', 'meta', 'youtube', 'google'].map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPlatform(p)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all border ${
              selectedPlatform === p
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {p === 'all' ? 'All Platforms' : p}
          </button>
        ))}
      </div>

      {/* Policy Guides List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="h-8 w-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span>Loading platform policy compendium...</span>
        </div>
      ) : (
        <div className="space-y-8">
          {policies.map((policy, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-950 text-purple-300 border border-purple-800">
                      {policy.platform}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">
                      Industry: {policy.industry.replace('-', ' ')}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">{policy.title}</h3>
                </div>

                {policy.officialPolicyUrl && (
                  <a
                    href={policy.officialPolicyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 font-medium whitespace-nowrap"
                  >
                    Official Docs <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">{policy.summary}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prohibited Practices */}
                <div className="p-5 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" /> Strictly Prohibited Practices
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {policy.prohibitedPractices.map((prac, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-red-400 font-bold shrink-0">✕</span>
                        <span>{prac}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Algo Safe Tips */}
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Algo-Safe Approval Strategies
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {policy.algoSafeTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Required Disclaimers */}
              {policy.requiredDisclaimers.length > 0 && (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-amber-400 block uppercase tracking-wider">
                    Mandatory Landing Page Disclaimers:
                  </span>
                  <div className="space-y-1 text-xs text-slate-400 font-mono">
                    {policy.requiredDisclaimers.map((disc, i) => (
                      <p key={i}>"{disc}"</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
