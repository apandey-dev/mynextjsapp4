import React from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import PublicFooter from '@/components/PublicFooter';
import {
  TrendingUp,
  Shield,
  PieChart,
  Zap,
  ArrowRight,
  Receipt,
  Layers,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-radial from-emerald-50/60 via-slate-50/30 to-white">
          <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-6 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Next.js App Router &bull; Neon Serverless PostgreSQL</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Master Your Spending with Precision &amp; Clarity.
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                A modern, production-grade financial management platform designed for ambitious professionals. Track categorized transactions, visualize cashflow trends, and take control of your financial freedom.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 transition-all active:scale-[0.98]"
                >
                  <span>Start Tracking Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors shadow-2xs"
                >
                  <span>Live Demo Sign In</span>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>No credit card required</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Real persistent database</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Edge-verified JWT</span>
                </span>
              </div>
            </div>

            {/* DASHBOARD PREVIEW MOCKUP */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200/80 bg-white p-3 sm:p-4 shadow-xl shadow-slate-200/50">
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 sm:p-8">
                {/* Mock header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Financial Overview</h3>
                    <p className="text-xs text-slate-500 mt-1">Real-time telemetry and cashflow breakdown</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                    Active Session
                  </span>
                </div>

                {/* Mock KPI cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Expenses</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">₹42,850.00</p>
                    <span className="text-[11px] text-emerald-600 font-medium">All-time tracked</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Current Month</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">₹18,400.00</p>
                    <span className="text-[11px] text-emerald-600 font-medium">+4.2% vs last month</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Transactions</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">28</p>
                    <span className="text-[11px] text-slate-500 font-medium">Across 6 categories</span>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-2xs">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Avg. Ticket</span>
                    <p className="text-xl font-bold text-slate-900 mt-1">₹1,530.35</p>
                    <span className="text-[11px] text-slate-500 font-medium">Per transaction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-20 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Engineered for Performance
              </h2>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Everything you need to manage your personal finances.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Month-over-Month Trends</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Interactive monthly trend area charts powered by Recharts illustrate spending spikes, seasonal variations, and historical patterns.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Categorized Visualizations</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Automatically segments Food, Travel, Bills, and Shopping with color-coordinated donut charts and percentage distribution breakdowns.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Granular Filters &amp; Pagination</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Real server-side database querying with debounced title search, date range boundaries, custom sorting, and multi-page pagination.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE SECTION */}
        <section id="architecture" className="py-20 bg-white">
          <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
                Under the Hood
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                Built with a modern full-stack stack.
              </h2>
              <p className="text-slate-600 mt-4 text-sm leading-relaxed">
                Demonstrating enterprise patterns including Edge Middleware JWT validation, Neon connection pooling with Prisma, and SWR cache revalidation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <Layers className="w-6 h-6 text-emerald-600 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">App Router (Next.js 16)</h4>
                <p className="text-xs text-slate-500 mt-1">Route handlers, Server Components, and seamless streaming boundaries.</p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <Shield className="w-6 h-6 text-emerald-600 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">Edge Middleware</h4>
                <p className="text-xs text-slate-500 mt-1">Jose HMAC-SHA256 token verification at the Edge preventing unauthorized execution.</p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <Zap className="w-6 h-6 text-emerald-600 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">Neon PostgreSQL</h4>
                <p className="text-xs text-slate-500 mt-1">Serverless autoscaling database with PgBouncer connection pooling.</p>
              </div>

              <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <Lock className="w-6 h-6 text-emerald-600 mb-3" />
                <h4 className="font-bold text-slate-900 text-sm">Strict Multi-Tenancy</h4>
                <p className="text-xs text-slate-500 mt-1">Every query enforces user ownership at the database level with Prisma ORM.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 bg-slate-900 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to take control of your financial destiny?
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
              Join FinLedger today and experience the speed of serverless financial telemetry.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
