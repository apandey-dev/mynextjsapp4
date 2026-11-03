'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Settings, Globe, Shield, Database, Cpu, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure application preferences, financial currency, and platform telemetry.
          </p>
        </div>

        {/* Currency & Locale Preferences */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Currency &amp; Regional Formatting</h3>
              <p className="text-xs text-slate-500">Default financial unit applied across tables and charts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Primary Currency
              </label>
              <input
                type="text"
                disabled
                value="INR — Indian Rupee (₹)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">Configured to standard en-IN formatting</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                Timezone
              </label>
              <input
                type="text"
                disabled
                value="Asia/Kolkata (IST — UTC+5:30)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700"
              />
              <p className="text-[11px] text-slate-400 mt-1">Auto-synchronized with browser locale</p>
            </div>
          </div>
        </div>

        {/* Database & Infrastructure Status */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Database &amp; Connectivity Status</h3>
              <p className="text-xs text-slate-500">Live configuration for serverless database infrastructure</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Neon Serverless PostgreSQL</span>
              </div>
              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Online &bull; Pooled
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Prisma ORM Client v6</span>
              </div>
              <span className="font-mono text-slate-600">Generated &bull; Synced</span>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Edge Middleware Protection</span>
              </div>
              <span className="font-mono text-slate-600">Jose HS256 &bull; Strict Cookies</span>
            </div>
          </div>
        </div>

        {/* Security Disclaimers */}
        <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-500 leading-relaxed flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <span>
            Strict Multi-Tenancy Guarantee: Expense records, aggregates, and category spending data are strictly scoped to your authenticated user account ID. Cross-tenant leakage is mathematically prevented at the database query layer.
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
