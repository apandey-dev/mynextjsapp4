import React from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

// Next.js App Router Incremental Static Regeneration (ISR) configuration
// This page statically regenerates in the background at most once every 60 seconds.
export const revalidate = 60;

const FINANCIAL_BENCHMARKS = [
  {
    rule: 'The 50/30/20 Budgeting Rule',
    tag: 'Foundational',
    description:
      'Allocate 50% of your net income to Needs (Rent, Utilities, Food), 30% to Wants (Entertainment, Travel), and 20% to Savings & Investments.',
    impact: 'High',
  },
  {
    rule: 'The 6-Month Emergency Cushion',
    tag: 'Liquidity',
    description:
      'Maintain 6 months of mandatory fixed living expenses in a liquid savings account or high-yield deposit before investing in aggressive equities.',
    impact: 'Critical',
  },
  {
    rule: 'The 30-Day Discretionary Rule',
    tag: 'Behavioral',
    description:
      'Before making a non-essential purchase exceeding ₹5,000, wait 30 days. If the urge persists and budget permits, proceed with the purchase.',
    impact: 'Medium',
  },
  {
    rule: 'Discretionary Dining Cap',
    tag: 'Optimization',
    description:
      'Keep restaurant dining, food delivery, and social cafe spending under 12% of total monthly outflow to protect compounding investment capital.',
    impact: 'High',
  },
];

export default async function InsightsPage() {
  const generatedTime = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1 py-12 lg:py-16">
        <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* HEADER */}
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-4 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next.js App Router ISR &bull; revalidate = 60s</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Financial Benchmarks &amp; Architectural Insights
            </h1>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Public financial management standards, behavioral budgeting strategies, and live architectural demonstration of Next.js Incremental Static Regeneration.
            </p>
          </div>

          {/* ISR TELEMETRY BADGE */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-slate-900/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Page Static Generation Timestamp
                </p>
                <p className="text-sm sm:text-base font-mono font-bold text-white mt-0.5">
                  {generatedTime} (IST)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Background ISR: 60-second revalidation TTL</span>
            </div>
          </div>

          {/* FINANCIAL BENCHMARKS GRID */}
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>Core Financial Principles &amp; Industry Standards</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {FINANCIAL_BENCHMARKS.map((item) => (
                <div
                  key={item.rule}
                  className="p-6 rounded-2xl border border-slate-200/80 bg-white shadow-2xs hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {item.tag}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">
                      Impact: {item.impact}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.rule}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ARCHITECTURAL COMPARISON: ISR vs SSR vs CSR */}
          <div className="p-8 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Architecture Explained: Why ISR for Insights vs SSR for Dashboard?</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                A critical design pattern in Next.js applications is selecting the correct data-fetching paradigm for each specific use-case.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  1. Incremental Static Regeneration
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">Used on /insights</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Statically pre-rendered at build time and cached on the global CDN. Background workers regenerate the HTML every 60 seconds without blocking user requests. Perfect for public, non-sensitive financial educational benchmarks.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  2. Authenticated API Handlers
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">Used on /api/expenses</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Dynamic server-side execution with `no-store` cache headers. Every query decrypts the incoming JWT cookie, verifies user ownership in Neon PostgreSQL, and returns strictly scoped records.
                </p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs">
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                  3. Client-Side SWR
                </span>
                <p className="text-sm font-bold text-slate-900 mt-1">Used on /dashboard</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Fetches live financial telemetry from `/api/dashboard/stats` with automatic revalidation on window focus, optimistic updates, and instant chart recalculations upon expense mutations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
