// app/ui/pengeluaran/table.tsx

import { formatCurrency } from '@/app/lib/utils';
import { Expense } from '@/app/lib/definitions';
import { UpdateExpense, DeleteExpense } from '@/app/ui/pengeluaran/buttons';

export default function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
        <p className="text-gray-500">Belum ada data pengeluaran.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-pink-50 border-b border-pink-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-pink-600 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-pink-600 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-pink-600 uppercase tracking-wider">
                Keterangan
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-pink-600 uppercase tracking-wider">
                Pembayaran
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-pink-600 uppercase tracking-wider">
                Jumlah
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-pink-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {expenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {new Date(expense.expense_date).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(expense.created_at).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                  {expense.description || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {expense.payment_method || '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-red-600">
                    {formatCurrency(expense.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <UpdateExpense id={expense.id} />
                    <DeleteExpense id={expense.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="bg-pink-50 px-6 py-4 border-t border-pink-100">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Total Pengeluaran:</span>
          <span className="text-xl font-bold text-pink-600">
            {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}