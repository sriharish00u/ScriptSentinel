import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">ScriptSentinel</span>
          </Link>
          <p className="text-sm text-slate-400 leading-relaxed">
            Real-time algorithmic compliance and shadowban detection engine for modern creators, media buyers, and agencies.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Daily Platform Algorithmic Synced (2026)
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Popular Searches (pSEO)</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/tiktok/banned-words/diet" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                Is "Diet" Banned on TikTok? <ArrowUpRight className="h-3 w-3" />
              </Link>
            </li>
            <li>
              <Link href="/meta/banned-words/giveaway" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                Instagram Giveaway Shadowban Rules <ArrowUpRight className="h-3 w-3" />
              </Link>
            </li>
            <li>
              <Link href="/meta/banned-words/weight-loss" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                Facebook Health Claims Ad Policy <ArrowUpRight className="h-3 w-3" />
              </Link>
            </li>
            <li>
              <Link href="/youtube/banned-words/murder" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                YouTube True Crime 30-Sec Rule <ArrowUpRight className="h-3 w-3" />
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Tools & Policies</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/#studio" className="hover:text-emerald-400 transition-colors">
                Real-Time Script Scanner
              </Link>
            </li>
            <li>
              <Link href="/url-scanner" className="hover:text-emerald-400 transition-colors">
                Landing Page URL Auditor
              </Link>
            </li>
            <li>
              <Link href="/database" className="hover:text-emerald-400 transition-colors">
                Banned Words & Algo-Safe Lexicon
              </Link>
            </li>
            <li>
              <Link href="/policies" className="hover:text-emerald-400 transition-colors">
                Platform Policy Compendium
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Legal & Compliance</h3>
          <p className="text-xs text-slate-500 leading-relaxed mb-4">
            ScriptSentinel is an independent analytics and compliance engine. YouTube, TikTok, Meta, Google, and X are trademarks of their respective owners.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/pricing" className="text-emerald-400 hover:underline">
              API Pricing Plans
            </Link>
            <a
              href="https://github.com/sriharish00u/ScriptSentinel"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 ScriptSentinel. All rights reserved.</p>
        <p>Built for content creators, ad agencies, and growth marketers worldwide.</p>
      </div>
    </footer>
  );
}
