import React from 'react';
import Link from 'next/link';
import { Wallet, ShieldCheck, Database, Cpu, Layers } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600">
      <div className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-100">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Wallet className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight text-lg">FinLedger</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Production-ready full-stack expense manager built with Next.js App Router, Prisma ORM, and Neon Serverless PostgreSQL.
            </p>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Application
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
                  Financial Dashboard
                </Link>
              </li>
              <li>
                <Link href="/expenses" className="hover:text-emerald-600 transition-colors">
                  Expense Management
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-emerald-600 transition-colors">
                  ISR Benchmark & Insights
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-600 transition-colors">
                  Secure Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture badges */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2 text-slate-500">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next.js 16 App Router</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>Neon PostgreSQL (Serverless)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>Prisma ORM & Connection Pooling</span>
              </li>
              <li className="flex items-center gap-2 text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Edge Runtime Middleware (Jose)</span>
              </li>
            </ul>
          </div>

          {/* Security & Isolation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
              Security
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every database operation verifies the authenticated user session on the server. Zero cross-tenant data leaks. Passwords securely hashed with bcryptjs.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} FinLedger Capstone Project. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built by Arpit Pandey</span>
            <span>&bull;</span>
            <span className="text-emerald-600 font-medium">Independent Capstone</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
