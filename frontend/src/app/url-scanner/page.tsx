'use client';

import React, { useState } from 'react';
import { scanLandingPageUrl } from '@/lib/api';
import { UrlScanResult, Platform } from '@/lib/types';
import RiskMeter from '@/components/RiskMeter';
import {
  Globe,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Layers,
} from 'lucide-react';

const SAMPLE_URLS = [
  'https://en.wikipedia.org/wiki/Weight_loss',
  'https://www.shopify.com',
  'https://news.ycombinator.com',
];

export default function UrlScannerPage() {
  const [url, setUrl] = useState<string>('https://en.wikipedia.org/wiki/Weight_loss');
  const [platform, setPlatform] = useState<Platform>('meta');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<UrlScanResult | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await scanLandingPageUrl(url, platform);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to scan URL. Please check the domain and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4">
          <Globe className="h-3.5 w-3.5" />
          Landing Page & E-Commerce Compliance Crawler
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Live URL <span className="text-blue-400">Compliance Auditor</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Paste any landing page or sales page URL. Our crawler extracts all copy, checks for mandatory legal disclaimers, detects fake urgency timers, and flags policy violation keywords.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-4xl mx-auto shadow-2xl">
        <form onSubmit={handleScan} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Globe className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-landing-page.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm font-sans"
              />
            </div>

            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="meta">Meta Ads (FB/IG)</option>
              <option value="google">Google Ads (Search/PMax)</option>
              <option value="tiktok">TikTok Ads</option>
              <option value="all">All Ad Networks</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                  Crawling Site...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Audit Landing Page
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Quick Samples:</span>
            {SAMPLE_URLS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setUrl(s)}
                className="text-blue-400 hover:underline truncate max-w-[200px]"
              >
                {s.replace('https://', '')}
              </button>
            ))}
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <XCircle className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Scan Results View */}
      {result && (
        <div className="space-y-8 max-w-5xl mx-auto">
          {/* Site Overview Bar */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Scanned Domain</span>
              <h3 className="text-xl font-bold text-white flex items-center gap-2 mt-0.5">
                {result.title || result.url}
                <a href={result.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-1">
                {result.metaDescription || 'No meta description found on page.'}
              </p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 text-xs text-slate-400 font-mono">
              <div>
                <span className="block text-white font-bold text-base">{result.extractedHeadingsCount}</span>
                <span>Headings Scanned</span>
              </div>
              <div>
                <span className="block text-white font-bold text-base">{result.scanResult.wordCount}</span>
                <span>Total Words</span>
              </div>
              <div>
                <span className="block text-red-400 font-bold text-base">{result.scanResult.flaggedCount}</span>
                <span>Triggers Flagged</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Compliance Checklist (6 cols) */}
            <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Mandatory Legal & Ad Checks
                </h3>
              </div>

              <div className="space-y-3">
                {result.landingPageAudits.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs ${
                      item.passed
                        ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                        : 'bg-red-950/20 border-red-500/20 text-red-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold">
                        {item.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        <span>{item.check}</span>
                      </div>
                      <p className="text-slate-400 text-[11px]">{item.recommendation}</p>
                    </div>
                    <span className="text-[10px] font-mono opacity-60 uppercase whitespace-nowrap">
                      {item.importance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Risk Gauge & Keyword Flags (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <RiskMeter
                score={result.scanResult.shadowbanRiskScore}
                riskLevel={result.scanResult.riskLevel}
              />

              <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
                  <span>Page Copy Triggers Detected</span>
                  <span className="text-xs text-slate-500">{result.scanResult.flaggedCount} items</span>
                </h3>

                {result.scanResult.flaggedTerms.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-1.5" />
                    <span>No blacklisted keywords found in page copy!</span>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {result.scanResult.flaggedTerms.map((t, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-red-400">
                          <span className="capitalize">"{t.term}"</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 uppercase">
                            {t.severity}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{t.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
