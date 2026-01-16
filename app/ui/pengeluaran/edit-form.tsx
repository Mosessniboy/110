// app/ui/pengeluaran/edit-form.tsx

'use client';

import { useActionState } from 'react';
import { updateExpense, ExpenseState } from '@/app/lib/actions';
import { Expense, EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/app/lib/definitions';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditExpenseForm({ expense }: { expense: Expense }) {
  const initialState: ExpenseState = { message: null, errors: {} };
  const updateExpenseWithId = updateExpense.bind(null, expense.id);
  const [state, formAction, isPending] = useActionState(updateExpenseWithId, initialState);

  return (
    <div className="bg-white rounded-xl border border-pink-200 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/pengeluaran"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <h2 className="text-xl font-bold text-pink-600">Edit Pengeluaran</h2>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* ✅ Kategori - INPUT dengan DATALIST (bisa ketik sendiri atau pilih) */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Kategori *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              list="category-suggestions"
              defaultValue={expense.category}
              placeholder="Ketik atau pilih kategori..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              aria-describedby="category-error"
              required
            />
            <datalist id="category-suggestions">
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {state.errors?.category && (
              <p id="category-error" className="mt-1 text-sm text-red-600">
                {state.errors.category[0]}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              💡 Pilih dari daftar atau ketik kategori baru
            </p>
          </div>

          {/* Jumlah */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah (Rp) *
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={expense.amount}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              aria-describedby="amount-error"
              required
            />
            {state.errors?.amount && (
              <p id="amount-error" className="mt-1 text-sm text-red-600">
                {state.errors.amount[0]}
              </p>
            )}
          </div>

          {/* Metode Pembayaran */}
          <div>
            <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-2">
              Metode Pembayaran
            </label>
            <select
              id="payment_method"
              name="payment_method"
              defaultValue={expense.payment_method || ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="">Pilih metode...</option>
              {PAYMENT_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* Tanggal */}
          <div>
            <label htmlFor="expense_date" className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal *
            </label>
            <input
              id="expense_date"
              name="expense_date"
              type="date"
              defaultValue={expense.expense_date}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              aria-describedby="date-error"
              required
            />
            {state.errors?.expense_date && (
              <p id="date-error" className="mt-1 text-sm text-red-600">
                {state.errors.expense_date[0]}
              </p>
            )}
          </div>
        </div>

        {/* Keterangan */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Keterangan (Opsional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={expense.description || ''}
            placeholder="Tambahkan catatan atau keterangan..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        {/* Error Message */}
        {state.message && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{state.message}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 justify-end pt-4">
          <Link
            href="/dashboard/pengeluaran"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Mengupdate...' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
}