'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Zap,
  ShieldCheck,
  Building,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

const TIERS = [
  {
    name: 'Free Starter',
    priceMonthly: 0,
    priceAnnual: 0,
    badge: 'Try Free',
    description: 'Perfect for testing single video scripts and discovering risky keywords.',
    features: [
      '3 Daily Script Scans',
      'Basic Shadowban Probability Score',
      'Community Banned Words Database',
      'TikTok & Meta basic rules',
      'Manual safe replacement suggestions',
    ],
    cta: 'Start Free Scan',
    href: '/#studio',
    popular: false,
  },
  {
    name: 'Creator',
    priceMonthly: 19,
    priceAnnual: 15,
    badge: 'Most Popular for YouTubers & TikTokers',
    description: 'Unlimited script protection for solo creators, video editors, and UGC influencers.',
    features: [
      'Unlimited Text & Script Scans',
      'Chrome Extension (YouTube / TikTok Studio)',
      '1-Click Auto-Fix & Safe Alternative Swapper',
      'YouTube 30-Sec Yellow Dollar Prevention',
      'TikTok FYP Reach Protection',
      'Instant Copy & Export to Teleprompter',
    ],
    cta: 'Upgrade to Creator ($19/mo)',
    href: '/#studio',
    popular: true,
  },
  {
    name: 'Agency',
    priceMonthly: 49,
    priceAnnual: 39,
    badge: 'Best for Media Buyers & Teams',
    description: 'Full compliance insurance for ad agencies, media buyers, and affiliate teams.',
    features: [
      'Everything in Creator',
      'Full Landing Page URL Scanner',
      'Mandatory Legal Disclaimer Verification',
      'Meta & Google Ads Policy Enforcement',
      'Team Multi-Seat Access (up to 5 copywriters)',
      'White-label PDF Compliance Audit Reports',
      'REST API Access (10,000 scans / mo)',
    ],
    cta: 'Get Agency Access ($49/mo)',
    href: '/#studio',
    popular: false,
  },
  {
    name: 'Enterprise',
    priceMonthly: 149,
    priceAnnual: 119,
    badge: 'For High-Volume Media Brands',
    description: 'Automated monitoring of entire ad catalogs and continuous compliance scraping.',
    features: [
      'Everything in Agency',
      'Automated Daily Ad Catalog Scraping',
      'Pre-Emptive Warning for New Banned Words',
      'Custom Brand Compliance Lexicon Rules',
      'Unlimited API Scans & Webhook Alerts',
      'Dedicated Account Manager & Slack SLA',
    ],
    cta: 'Contact Enterprise ($149/mo)',
    href: '/#studio',
    popular: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          Zero-Risk Compliance Insurance
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          Simple, Transparent <span className="text-emerald-400">Pricing</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mt-4 leading-relaxed">
          One disabled ad account or suppressed video costs you thousands. Protect your revenue with real-time algorithm compliance.
        </p>

        {/* Toggle Billing */}
        <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-full bg-slate-900 border border-slate-800">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              !annual ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 ${
              annual ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Annual Billing <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded-full border border-emerald-500/30">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {TIERS.map((tier, idx) => {
          const price = annual ? tier.priceAnnual : tier.priceMonthly;

          return (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all relative ${
                tier.popular
                  ? 'glass-panel border-2 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105 z-10'
                  : 'glass-panel border border-slate-800 hover:border-slate-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                </div>

                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-extrabold text-white font-mono">${price}</span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>

                <p className="text-xs text-slate-400 min-h-[36px] mb-6 leading-relaxed">
                  {tier.description}
                </p>

                <div className="space-y-3 pt-6 border-t border-slate-800 text-xs">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    What's Included:
                  </span>
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6">
                <Link
                  href={tier.href}
                  className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    tier.popular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {tier.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 max-w-4xl mx-auto space-y-6">
        <h3 className="text-2xl font-bold text-white text-center">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs sm:text-sm">
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="font-bold text-white">How often are platform algorithms updated?</h4>
            <p className="text-slate-400">
              Our automated crawlers and compliance researchers update the restricted terms database weekly, reflecting unannounced policy shifts on TikTok, Meta, and YouTube.
            </p>
          </div>
          <div className="space-y-1.5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <h4 className="font-bold text-white">Can I integrate ScriptSentinel into our agency CMS?</h4>
            <p className="text-slate-400">
              Yes! Agency and Enterprise plans include REST API keys to scan drafts automatically in your content pipeline or WordPress/Webflow editors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
