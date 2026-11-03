'use client';

import React, { use } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import ExpenseForm from '@/components/ExpenseForm';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to retrieve expense record');
    return res.json();
  });

export default function EditExpensePage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data, error, isLoading } = useSWR(`/api/expenses/${id}`, fetcher);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Modify Expense</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update transaction amounts, recategorize, or adjust timestamp details.
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
            <p className="text-xs">Fetching expense details from database...</p>
          </div>
        ) : error || !data?.expense ? (
          <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center text-slate-600">
            <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">Expense Not Found</h3>
            <p className="text-xs text-slate-500 mt-1">
              This record either does not exist or does not belong to your account.
            </p>
            <Link
              href="/expenses"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Expenses</span>
            </Link>
          </div>
        ) : (
          <ExpenseForm initialData={data.expense} isEdit={true} />
        )}
      </div>
    </DashboardLayout>
  );
}
