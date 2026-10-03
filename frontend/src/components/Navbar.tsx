'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ShieldAlert, Sparkles, Globe, BookOpen, Layers } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Script<span className="text-emerald-400">Sentinel</span>
              <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                v2026.4
              </span>
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            Scanner Studio
          </Link>
          <Link href="/url-scanner" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Globe className="h-4 w-4 text-blue-400" />
            URL Auditor
          </Link>
          <Link href="/database" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            Banned Words Database
          </Link>
          <Link href="/policies" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-purple-400" />
            Platform Policies
          </Link>
          <Link href="/pricing" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-cyan-400" />
            Pricing
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Algo Engine Live
          </div>
          <Link
            href="/#studio"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 hover:bg-emerald-400 transition-colors"
          >
            Scan Script Now
          </Link>
        </div>
      </div>
    </header>
  );
}
