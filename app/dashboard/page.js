'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import DashboardLayout from '@/components/DashboardLayout';
import { MonthlyTrendChart, CategoryPieChart } from '@/components/ExpenseCharts';
import { formatINR, formatDate, CATEGORY_COLORS } from '@/lib/formatters';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Calendar,
  Receipt,
  PlusCircle,
  RefreshCw,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to load dashboard metrics');
    return res.json();
  });

export default function DashboardPage() {
  const { data, error, isLoading, mutate } = useSWR('/api/dashboard/stats', fetcher, {
    revalidateOnFocus: true,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* WELCOME BANNER & ACTION BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Welcome back, {data?.userName || 'Financial Champion'}!
              </h1>
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse hidden sm:block" />
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Here is your live financial snapshot and monthly spending telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => mutate()}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
              title="Refresh Metrics"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/expenses/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-xs shadow-emerald-600/20 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Expense</span>
            </Link>
          </div>
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center justify-between">
            <span>Failed to load live metrics: {error.message}</span>
            <button onClick={() => mutate()} className="font-semibold underline text-xs">
              Retry
            </button>
          </div>
        )}

        {/* 4 TOP SUMMARY KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Expenses */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Expenses
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-8 w-28 bg-slate-100 rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold font-mono text-slate-900">
                  {formatINR(data?.stats?.totalExpenses || 0)}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">All-time recorded</p>
            </div>
          </div>

          {/* Current Month */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Month
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-8 w-28 bg-slate-100 rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold font-mono text-slate-900">
                  {formatINR(data?.stats?.currentMonthTotal || 0)}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-1 text-xs">
                {data?.stats?.monthOverMonthChange > 0 ? (
                  <span className="text-amber-600 font-medium inline-flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                    +{data.stats.monthOverMonthChange}% vs prev month
                  </span>
                ) : data?.stats?.monthOverMonthChange < 0 ? (
                  <span className="text-emerald-600 font-medium inline-flex items-center">
                    <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                    {data.stats.monthOverMonthChange}% vs prev month
                  </span>
                ) : (
                  <span className="text-slate-400 font-medium">No previous month delta</span>
                )}
              </div>
            </div>
          </div>

          {/* Transaction Count */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Transactions
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-8 w-16 bg-slate-100 rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold font-mono text-slate-900">
                  {data?.stats?.totalTransactions || 0}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                {data?.stats?.currentMonthCount || 0} transactions this month
              </p>
            </div>
          </div>

          {/* Average Expense */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Average Ticket
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              {isLoading ? (
                <div className="h-8 w-24 bg-slate-100 rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold font-mono text-slate-900">
                  {formatINR(data?.stats?.averageExpense || 0)}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">Per individual transaction</p>
            </div>
          </div>
        </div>

        {/* CHARTS GRID: MONTHLY TREND + CATEGORY BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Trend Area Chart (2 Columns on large screens) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Monthly Spending Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Historical 6-month transaction flow</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                Past 6 Months
              </span>
            </div>

            {isLoading ? (
              <div className="h-72 w-full bg-slate-50 rounded-xl animate-pulse" />
            ) : (
              <MonthlyTrendChart data={data?.monthlyTrend || []} />
            )}
          </div>

          {/* Category Pie Chart (1 Column on large screens) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Category Breakdown</h3>
                <p className="text-xs text-slate-500 mt-0.5">Distribution across spending domains</p>
              </div>
            </div>

            {isLoading ? (
              <div className="h-72 w-full bg-slate-50 rounded-xl animate-pulse" />
            ) : (
              <CategoryPieChart data={data?.categoryData || []} />
            )}
          </div>
        </div>

        {/* RECENT TRANSACTIONS TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Latest expenses logged in your account</p>
            </div>
            <Link
              href="/expenses"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              <span>View All Expenses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-6">Expense Title</th>
                  <th className="py-3 px-6">Category</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Method</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      Loading recent transactions...
                    </td>
                  </tr>
                ) : data?.recentExpenses && data.recentExpenses.length > 0 ? (
                  data.recentExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-900">
                        {exp.title}
                        {exp.description && (
                          <span className="block text-xs font-normal text-slate-400 truncate max-w-xs">
                            {exp.description}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[exp.category] || '#64748b'}15`,
                            color: CATEGORY_COLORS[exp.category] || '#64748b',
                          }}
                        >
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-500">{formatDate(exp.date)}</td>
                      <td className="py-3.5 px-6 text-xs text-slate-600 font-medium">
                        {exp.paymentMethod || 'UPI'}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono font-semibold text-slate-900">
                        {formatINR(exp.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400">
                      <p className="font-medium text-sm">No expenses recorded yet</p>
                      <Link
                        href="/expenses/new"
                        className="inline-block mt-2 text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        Click here to add your first expense
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
