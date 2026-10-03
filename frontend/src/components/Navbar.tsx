'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { ShieldCheck, ShieldAlert, Sparkles, Globe, BookOpen, Layers, User, LogOut, Video } from 'lucide-react';

export default function Navbar() {
  const { user, openAuth, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="h-5 w-5 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Script<span className="text-emerald-400">Sentinel</span>
              <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.2 text-[9px] font-mono text-emerald-400 border border-emerald-500/20">
                AI 2026
              </span>
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-300">
          <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Scanner Studio
          </Link>
          <Link href="/#transcription" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5 text-red-400" />
            Video Transcription
          </Link>
          <Link href="/url-scanner" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-blue-400" />
            URL Auditor
          </Link>
          <Link href="/database" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            Lexicon Database
          </Link>
          <Link href="/policies" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-purple-400" />
            Policies
          </Link>
          <Link href="/pricing" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            Pricing
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs">
                <User className="h-3.5 w-3.5 text-emerald-400" />
                <span className="font-semibold text-white">{user.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 uppercase font-mono">
                  {user.tier}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth('login')}
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuth('register')}
                className="rounded-lg bg-emerald-500 hover:bg-emerald-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
