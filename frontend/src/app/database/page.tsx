'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchRestrictedTerms } from '@/lib/api';
import { RestrictedTermItem } from '@/lib/types';
import {
  ShieldAlert,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  AlertOctagon,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export default function DatabasePage() {
  const [terms, setTerms] = useState<RestrictedTermItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchRestrictedTerms({
        query: search,
        platform: platformFilter,
        severity: severityFilter,
        category: categoryFilter,
      });
      setTerms(data);
      setLoading(false);
    }
    const timer = setTimeout(loadData, 200);
    return () => clearTimeout(timer);
  }, [search, platformFilter, severityFilter, categoryFilter]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-4">
          <ShieldAlert className="h-3.5 w-3.5" />
          2026 Algorithmic Compliance Lexicon
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Restricted Words & <span className="text-amber-400">Algo-Safe Database</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Explore terms that trigger shadowbans, demonetization, or ad account suspension across TikTok, YouTube, Meta, and Google Ads.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords, triggers, or reasons (e.g., 'weight loss', 'giveaway', 'kill')..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm font-sans"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="all">Platform: All Channels</option>
            <option value="tiktok">Platform: TikTok (FYP)</option>
            <option value="youtube">Platform: YouTube (Monetization)</option>
            <option value="meta">Platform: Meta (FB & IG Ads)</option>
            <option value="google">Platform: Google Ads</option>
            <option value="x">Platform: X (Twitter)</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="">Severity: All Levels</option>
            <option value="critical">Severity: Critical (Instant Ban)</option>
            <option value="high">Severity: High (Reach Throttle)</option>
            <option value="moderate">Severity: Moderate (Review Delay)</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="">Category: All Categories</option>
            <option value="health_medical">Health & Medical Claims</option>
            <option value="financial_guarantees">Financial & Biz-Opp Guarantees</option>
            <option value="sensitive_violence">Sensitive & Violence (True Crime)</option>
            <option value="engagement_bait">Engagement Bait & Contests</option>
            <option value="weapons_drugs">Weapons, Drugs & Regulated Goods</option>
          </select>
        </div>
      </div>

      {/* Terms Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500">
          <div className="h-8 w-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span>Loading algorithmic compliance database...</span>
        </div>
      ) : terms.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 text-slate-400">
          <AlertOctagon className="h-10 w-10 text-slate-600 mx-auto mb-2" />
          <p className="text-white font-bold">No restricted terms matched your search.</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the filters or searching for general keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {terms.map((item) => {
            const primaryPlatform = item.platforms.includes('all') ? 'meta' : item.platforms[0];
            const pseoUrl = `/${primaryPlatform}/banned-words/${item.slug}`;

            return (
              <div
                key={item._id || item.slug}
                className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        item.severity === 'critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : item.severity === 'high'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.severity} • {item.riskScore}% Risk
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono capitalize">
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white capitalize flex items-center justify-between group-hover:text-amber-400 transition-colors">
                    "{item.term}"
                    <Link href={pseoUrl} className="text-slate-500 hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </h3>

                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {item.reason}
                  </p>

                  {/* Safe Alternatives */}
                  {item.safeAlternatives && item.safeAlternatives.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <span className="text-[11px] font-semibold text-emerald-400 block mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Algo-Safe Alternatives:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.safeAlternatives.map((alt, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/20"
                          >
                            {alt}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="capitalize">Platforms: {item.platforms.join(', ')}</span>
                  <Link
                    href={pseoUrl}
                    className="text-amber-400 hover:underline font-medium flex items-center gap-1"
                  >
                    View Policy Guide
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
