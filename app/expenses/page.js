'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import DashboardLayout from '@/components/DashboardLayout';
import DeleteModal from '@/components/DeleteModal';
import { formatINR, formatDate, CATEGORY_COLORS } from '@/lib/formatters';
import { EXPENSE_CATEGORIES } from '@/lib/validations';
import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Download,
} from 'lucide-react';

const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error('Failed to load expenses');
    return res.json();
  });

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // reset to page 1 on search change
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Construct API query URL
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: '10',
    sortBy,
    sortOrder,
  });
  if (debouncedSearch) queryParams.set('search', debouncedSearch);
  if (category && category !== 'All') queryParams.set('category', category);
  if (dateRange && dateRange !== 'all') queryParams.set('dateRange', dateRange);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/expenses?${queryParams.toString()}`,
    fetcher,
    { keepPreviousData: true }
  );

  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete expense');
      setDeleteTarget(null);
      mutate();
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* TOP BAR: HEADER & ADD BUTTON */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Expense Records</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Filter, search, audit, and manage all your tracked transactions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/expenses/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm shadow-xs shadow-emerald-600/20 transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Expense</span>
            </Link>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, CATEGORY, DATE, SORT */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by expense title..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            {/* Category Filter Dropdown */}
            <div>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="All">All Categories</option>
                {EXPENSE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Dropdown */}
            <div>
              <select
                value={dateRange}
                onChange={(e) => {
                  setDateRange(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="all">All Dates</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="7_days">Last 7 Days</option>
                <option value="30_days">Last 30 Days</option>
              </select>
            </div>

            {/* Sorting Dropdown */}
            <div>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                  setPage(1);
                }}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="amount-desc">Amount (Highest First)</option>
                <option value="amount-asc">Amount (Lowest First)</option>
                <option value="title-asc">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Filter Summary Banner */}
          {data?.summary && (
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span>
                  Showing <strong className="text-slate-800">{data.pagination.total}</strong> results
                </span>
                <span>&bull;</span>
                <span>
                  Filtered Sum:{' '}
                  <strong className="text-slate-900 font-mono font-semibold">
                    {formatINR(data.summary.filteredTotal)}
                  </strong>
                </span>
              </div>

              {(search || category !== 'All' || dateRange !== 'all') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory('All');
                    setDateRange('all');
                    setPage(1);
                  }}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* EXPENSES TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th
                    className="py-3 px-6 cursor-pointer hover:text-slate-700"
                    onClick={() => handleSortToggle('title')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Expense Title</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-6">Category</th>
                  <th
                    className="py-3 px-6 cursor-pointer hover:text-slate-700"
                    onClick={() => handleSortToggle('date')}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Date</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-6">Method</th>
                  <th
                    className="py-3 px-6 text-right cursor-pointer hover:text-slate-700"
                    onClick={() => handleSortToggle('amount')}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Amount</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      Loading expenses...
                    </td>
                  </tr>
                ) : data?.expenses && data.expenses.length > 0 ? (
                  data.expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-slate-900">
                        {item.title}
                        {item.description && (
                          <span className="block text-xs font-normal text-slate-400 truncate max-w-xs mt-0.5">
                            {item.description}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-6">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${CATEGORY_COLORS[item.category] || '#64748b'}15`,
                            color: CATEGORY_COLORS[item.category] || '#64748b',
                          }}
                        >
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-slate-500">{formatDate(item.date)}</td>
                      <td className="py-3.5 px-6 text-xs text-slate-600 font-medium">
                        {item.paymentMethod || 'UPI'}
                      </td>
                      <td className="py-3.5 px-6 text-right font-mono font-semibold text-slate-900">
                        {formatINR(item.amount)}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Link
                            href={`/expenses/${item.id}/edit`}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Expense"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400">
                      <div className="max-w-xs mx-auto">
                        <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                        <p className="font-semibold text-slate-700 text-sm">No expenses matched your search</p>
                        <p className="text-xs text-slate-400 mt-1">
                          Try adjusting your filters, searching with different terms, or record a new expense.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          {data?.pagination && data.pagination.totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={data.pagination.page <= 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={data.pagination.page >= data.pagination.totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        expenseTitle={deleteTarget?.title}
        isDeleting={isDeleting}
      />
    </DashboardLayout>
  );
}
