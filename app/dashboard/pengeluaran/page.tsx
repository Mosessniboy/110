// app/dashboard/pengeluaran/page.tsx

import { Suspense } from 'react';
import { fetchExpenses, fetchExpenseSummary } from '@/app/lib/data';
import ExpenseSummaryCards from '@/app/ui/pengeluaran/cards';
import ExpenseTable from '@/app/ui/pengeluaran/table';
import { CreateExpense } from '@/app/ui/pengeluaran/buttons';
import ExpenseSearch from '@/app/ui/pengeluaran/search';
import { Filter } from 'lucide-react';

export default async function PengeluaranPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category?: string;
  };
}) {
  const query = searchParams?.query || '';
  const category = searchParams?.category || '';

  const [expenses, summary] = await Promise.all([
    fetchExpenses(query, category),
    fetchExpenseSummary(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-pink-600">💰 Pengeluaran</h1>
          <p className="text-gray-600 mt-1">Kelola dan pantau pengeluaran operasional</p>
        </div>
        <CreateExpense />
      </div>

      {/* Summary Cards */}
      <Suspense fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-xl" />}>
        <ExpenseSummaryCards data={summary} />
      </Suspense>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input (Client Component) */}
          <ExpenseSearch />

          {/* Category Filter (Optional untuk nanti) */}
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Expense Table */}
      <Suspense fallback={
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      }>
        <ExpenseTable expenses={expenses} />
      </Suspense>

      {/* Info Footer */}
      {expenses.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <span className="font-semibold">Tips:</span> Catat semua pengeluaran secara rutin untuk mendapatkan laporan keuangan yang akurat.
          </p>
        </div>
      )}
    </div>
  );
}