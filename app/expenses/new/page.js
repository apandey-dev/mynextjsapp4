import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ExpenseForm from '@/components/ExpenseForm';

export const metadata = {
  title: 'Add New Expense — FinLedger',
};

export default function NewExpensePage() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Record Expense</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Capture a new outgoing transaction with categorization and payment metadata.
          </p>
        </div>

        <ExpenseForm />
      </div>
    </DashboardLayout>
  );
}
