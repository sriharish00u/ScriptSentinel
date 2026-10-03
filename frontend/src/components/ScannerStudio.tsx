'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Platform,
  ScanResult,
  MatchHighlight,
} from '@/lib/types';
import { scanScriptText } from '@/lib/api';
import RiskMeter from './RiskMeter';
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertOctagon,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  FileText,
  SlidersHorizontal,
  Flame,
  Download,
} from 'lucide-react';

const PRESETS = [
  {
    label: '⚡ Health & Supplement Ad',
    platform: 'tiktok' as Platform,
    text: `Are you tired of stubborn belly fat? Our new fat burner miracle pill guarantees rapid weight loss in just 14 days without any strict diet! Look at this incredible before and after transformation. Order now and cure your low energy forever!`,
  },
  {
    label: '🎙️ True Crime Story Script',
    platform: 'youtube' as Platform,
    text: `In this episode, we investigate the chilling unsolved murder of John Doe. Witnesses claim they saw a man with a gun before the fatal suicide incident took place. The suspect threatened to kill anyone who spoke to the police.`,
  },
  {
    label: '💎 Crypto & Biz-Opp Promo',
    platform: 'meta' as Platform,
    text: `Want to make $10,000/month with passive income? Join our exclusive crypto giveaway today and discover the secret loophole to get rich quick! DM me for info right now and tag 3 friends to enter the giveaway!`,
  },
  {
    label: '🛍️ Dropshipping Viral Hook',
    platform: 'meta' as Platform,
    text: `Stop scrolling! This botox alternative is going viral. We are running a massive 90% off free giveaway today only. DM me for info or follow for follow to get the exclusive discount code!`,
  },
];

const PLATFORMS: { id: Platform; label: string; icon: string }[] = [
  { id: 'all', label: 'All Platforms', icon: '🌐' },
  { id: 'tiktok', label: 'TikTok (FYP & Ads)', icon: '🎵' },
  { id: 'youtube', label: 'YouTube (Monetization)', icon: '▶️' },
  { id: 'meta', label: 'Meta (IG & FB Ads)', icon: '♾️' },
  { id: 'google', label: 'Google Ads', icon: '🔍' },
  { id: 'x', label: 'X (Twitter)', icon: '𝕏' },
];

export default function ScannerStudio() {
  const [text, setText] = useState<string>(PRESETS[0].text);
  const [platform, setPlatform] = useState<Platform>('all');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedMatch, setSelectedMatch] = useState<MatchHighlight | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'safe' | 'breakdown'>('editor');
  const [copied, setCopied] = useState<boolean>(false);

  const runScan = async (inputText: string, selectedPlatform: Platform) => {
    startTransition(async () => {
      const res = await scanScriptText(inputText, selectedPlatform);
      setResult(res);
      if (res.matches && res.matches.length > 0) {
        setSelectedMatch(res.matches[0]);
      } else {
        setSelectedMatch(null);
      }
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      runScan(text, platform);
    }, 250);
    return () => clearTimeout(handler);
  }, [text, platform]);

  const handleApplyReplacement = (term: string, replacement: string) => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi');
    const newText = text.replace(regex, replacement);
    setText(newText);
  };

  const handleApplyAllSafeReplacements = () => {
    if (result?.safeRewrittenText) {
      setText(result.safeRewrittenText);
    }
  };

  const handleCopySafe = () => {
    if (result?.safeRewrittenText) {
      navigator.clipboard.writeText(result.safeRewrittenText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scriptsentinel-audit-${Date.now()}.json`;
    a.click();
  };

  return (
    <section id="studio" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Live Algorithmic Compliance Studio
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Script & Ad Copy <span className="text-emerald-400">Scanner</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1">
            Type or paste your video script, caption, or ad copy. Instantly flag shadowban keywords & replace with algo-safe alternatives.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleApplyAllSafeReplacements}
            disabled={!result || result.flaggedCount === 0}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-950 transition-all shadow-lg shadow-emerald-500/10"
          >
            <Sparkles className="h-4 w-4" />
            Auto-Fix All Flagged Terms
          </button>
          <button
            onClick={handleExportJson}
            disabled={!result}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 px-3 py-2.5 text-xs sm:text-sm font-medium text-slate-300 transition-colors"
          >
            <Download className="h-4 w-4" />
            Audit Export
          </button>
        </div>
      </div>

      {/* Platform Selector Pills */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => setPlatform(p.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
              platform === p.id
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <span>{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Preset Buttons */}
      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 font-medium whitespace-nowrap mr-1">Load Preset:</span>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setText(preset.text);
              setPlatform(preset.platform);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors whitespace-nowrap"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Editor & Tabs (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="glass-panel rounded-2xl p-4 sm:p-6 shadow-xl border border-slate-800/80 flex flex-col h-full">
            {/* Tab Controls */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'editor'
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-emerald-400" />
                  Editor & Highlighting
                </button>
                <button
                  onClick={() => setActiveTab('safe')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'safe'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  Safe Rewrite
                </button>
                <button
                  onClick={() => setActiveTab('breakdown')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    activeTab === 'breakdown'
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AlertOctagon className="h-3.5 w-3.5 text-amber-400" />
                  Flags ({result?.flaggedCount || 0})
                </button>
              </div>

              <div className="text-xs text-slate-500 font-mono flex items-center gap-3">
                <span>{result?.wordCount || 0} words</span>
                <span>{result?.charCount || 0} chars</span>
              </div>
            </div>

            {/* Tab 1: Editor */}
            {activeTab === 'editor' && (
              <div className="flex-1 flex flex-col">
                <div className="relative flex-1 min-h-[300px]">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your video script, TikTok caption, or Facebook ad copy here..."
                    className="w-full h-full min-h-[300px] p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-y font-sans text-sm sm:text-base leading-relaxed"
                  />
                </div>

                {/* Highlighted keyword tags below editor */}
                {result && result.matches.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <span className="text-xs font-semibold text-slate-400 block mb-2">
                      Detected Algorithmic Triggers (Click to inspect):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {result.matches.map((m, idx) => {
                        const isCrit = m.severity === 'critical';
                        const isHigh = m.severity === 'high';
                        const isSelected = selectedMatch?.matchedText === m.matchedText;

                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedMatch(m)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                              isCrit
                                ? 'bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20'
                                : isHigh
                                ? 'bg-orange-500/10 text-orange-300 border-orange-500/30 hover:bg-orange-500/20'
                                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                            } ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            <span>{m.matchedText}</span>
                            <span className="text-[10px] opacity-75 uppercase">({m.severity})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Safe Rewrite */}
            {activeTab === 'safe' && (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-emerald-500/30 text-slate-100 font-sans text-sm sm:text-base leading-relaxed min-h-[300px]">
                  {result?.safeRewrittenText || 'No text scanned yet.'}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-4 w-4" /> 100% Algo-Safe Sanitized Version
                  </span>
                  <button
                    onClick={handleCopySafe}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copied Safe Script!' : 'Copy Safe Script'}
                  </button>
                </div>
              </div>
            )}

            {/* Tab 3: Detailed Flag Breakdown */}
            {activeTab === 'breakdown' && (
              <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {result?.flaggedTerms.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Check className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                    <p className="font-semibold text-white">No Flagged Terms</p>
                    <p className="text-xs text-slate-500 mt-1">Your script meets all current 2026 platform standards.</p>
                  </div>
                ) : (
                  result?.flaggedTerms.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200 text-sm capitalize">{item.term}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            item.severity === 'critical'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                          }`}
                        >
                          {item.severity} ({item.occurrences}x)
                        </span>
                      </div>
                      <p className="text-slate-400">{item.reason}</p>
                      <div className="pt-2 flex flex-wrap items-center gap-1.5">
                        <span className="text-emerald-400 font-semibold">Safe Options:</span>
                        {item.safeAlternatives.map((alt, i) => (
                          <button
                            key={i}
                            onClick={() => handleApplyReplacement(item.term, alt)}
                            className="bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] transition-colors"
                          >
                            + {alt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Risk Score & Inspector (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Risk Gauge */}
          <RiskMeter
            score={result?.shadowbanRiskScore || 0}
            riskLevel={result?.riskLevel || 'Clean'}
          />

          {/* Selected Trigger Inspector Card */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-400" />
                  Algorithm Trigger Inspector
                </span>
                {selectedMatch && (
                  <span className="text-[10px] font-mono text-slate-500">
                    Category: {selectedMatch.category}
                  </span>
                )}
              </div>

              {selectedMatch ? (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-500">Flagged Phrase:</span>
                    <h4 className="text-xl font-bold text-red-400 capitalize flex items-center gap-2 mt-0.5">
                      "{selectedMatch.matchedText}"
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800 font-normal uppercase">
                        {selectedMatch.severity}
                      </span>
                    </h4>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
                    <span className="font-semibold text-amber-400 block">Why Platforms Suppress This:</span>
                    <p className="leading-relaxed text-slate-300">{selectedMatch.reason}</p>
                  </div>

                  {/* 1-Click Safe Replacements */}
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-2">
                      Click to Swap in Editor:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedMatch.safeAlternatives.map((alt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleApplyReplacement(selectedMatch.term, alt)}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/30 hover:bg-emerald-900/40 border border-emerald-500/20 text-emerald-300 text-xs font-medium transition-all group text-left"
                        >
                          <span className="font-semibold">{alt}</span>
                          <span className="text-[11px] text-emerald-400 opacity-80 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            Swap <ArrowRight className="h-3 w-3" />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">
                  <ShieldCheck className="h-10 w-10 text-emerald-500/60 mx-auto mb-2" />
                  <p className="text-slate-300 font-medium">All Clear!</p>
                  <p className="mt-1">No prohibited compliance triggers currently selected.</p>
                </div>
              )}
            </div>

            {/* Severity Distribution Footnote */}
            {result && result.flaggedCount > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-800/80 grid grid-cols-4 gap-2 text-center">
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-red-400 font-bold block">CRITICAL</span>
                  <span className="text-sm font-extrabold text-white font-mono">{result.severityBreakdown.critical}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-orange-400 font-bold block">HIGH</span>
                  <span className="text-sm font-extrabold text-white font-mono">{result.severityBreakdown.high}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-amber-400 font-bold block">MODERATE</span>
                  <span className="text-sm font-extrabold text-white font-mono">{result.severityBreakdown.moderate}</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-bold block">CLEAN WORDS</span>
                  <span className="text-sm font-extrabold text-white font-mono">{result.wordCount - result.flaggedCount}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
