import React from 'react';
import Link from 'next/link';
import ScannerStudio from '@/components/ScannerStudio';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  TrendingDown,
  Sparkles,
  ArrowRight,
  Globe,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-16 pb-20">
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] -z-10 rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-6">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          Updated for 2026 Platform Algorithmic Rules
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Stop Losing Views & Ad Accounts to{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Hidden Algorithm Bans
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          One single phrase like <em>"weight loss"</em>, <em>"giveaway"</em>, or <em>"crypto"</em> can silently destroy your TikTok FYP distribution, demonetize your YouTube video, or ban your Facebook Ads. 
          ScriptSentinel scans your text in real time and provides <strong>1-click algo-safe replacements</strong>.
        </p>

        {/* Live Metrics Header */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>150+ Flagged Triggers Indexed</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Sub-50ms Realtime Tokenizer</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-400" />
            <span>TikTok • YouTube • Meta • Google</span>
          </div>
        </div>
      </section>

      {/* CORE PRODUCT: LIVE SCANNER STUDIO */}
      <ScannerStudio />

      {/* THE VALUE PROPOSITION & PAIN POINTS */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
            The Algorithmic Trap
          </h3>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Why Creators & Marketers Silently Get Shadowbanned
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Platform AI moderation bots don't notify you when you violate an unwritten policy. They simply zero-out your distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-red-500/20 relative overflow-hidden group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 mb-4">
              <TrendingDown className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">TikTok FYP Reach Suppression</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Words like "diet", "kill", or "fat burner" in speech or captions trip automated youth safety filters, locking your video at 200 views.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-red-300 font-mono">
              Fix: "diet" → "wellness routine"
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 relative overflow-hidden group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">YouTube Yellow Dollar Demonetization</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Speaking sensitive terms ("murder", "suicide", "weapons") in the first 30 seconds triggers advertiser-unfriendly demonetization flags.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-amber-300 font-mono">
              Fix: "murder" → "unlawful passing"
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 relative overflow-hidden group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Meta & Google Ad Disapprovals</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Unsubstantiated income claims ("$10,000/mo") or before-and-after promises disable ad accounts with thousands in accumulated ad spend.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-blue-300 font-mono">
              Fix: "income guarantee" → "revenue framework"
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMMATIC SEO KEYWORD DIRECTORY HUB */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-800 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <Search className="h-3.5 w-3.5" /> High-Intent Algorithmic Lookup
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Platform Banned Word & Policy Library
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Explore our programmatic SEO intelligence pages for exact policy rulings across all channels.
              </p>
            </div>
            <Link
              href="/database"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              Browse Full Dictionary ({25}+ Terms) <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/tiktok/banned-words/diet"
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-all group"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase">TikTok FYP Algorithm</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 mt-1 flex items-center justify-between">
                Is "Diet" Banned on TikTok?
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                Why TikTok throttles diet captions and the 4 safe alternatives top influencers use.
              </p>
            </Link>

            <Link
              href="/meta/banned-words/giveaway"
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-all group"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase">Instagram Explore Algorithm</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 mt-1 flex items-center justify-between">
                Giveaway Shadowban Rules
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                How Instagram's engagement bait detection suppresses posts with tag-to-win mechanics.
              </p>
            </Link>

            <Link
              href="/youtube/banned-words/murder"
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-all group"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase">YouTube Partner Program</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 mt-1 flex items-center justify-between">
                True Crime 30-Sec Monetization
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                Avoid the yellow dollar sign in documentaries by substituting graphic violence terminology.
              </p>
            </Link>

            <Link
              href="/meta/banned-words/weight-loss"
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 transition-all group"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase">Meta Ads Moderation</span>
              <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 mt-1 flex items-center justify-between">
                Health Claims Ad Rejection Fix
                <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </h4>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                Learn why personal health attributes trigger instant AI review rejections.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Protect Your Distribution Before You Hit <span className="text-emerald-400">Publish</span>
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto mt-4 text-sm sm:text-base">
            Never risk another rejected ad or suppressed video. Use our live scanner to keep your copy 100% compliant with 2026 platform algorithms.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#studio"
              className="w-full sm:w-auto rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 py-3 text-sm font-extrabold text-slate-950 shadow-lg shadow-emerald-500/20 transition-all"
            >
              Start Free Script Scan
            </Link>
            <Link
              href="/url-scanner"
              className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-8 py-3 text-sm font-semibold text-white transition-colors"
            >
              Audit Landing Page URL
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
