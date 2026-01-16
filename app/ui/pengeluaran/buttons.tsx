// app/ui/pengeluaran/buttons.tsx

'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteExpense } from '@/app/lib/actions';

export function CreateExpense() {
  return (
    <Link
      href="/dashboard/pengeluaran/tambah"
      className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2.5 rounded-lg hover:bg-pink-700 transition-colors shadow-md"
    >
      <Plus className="w-5 h-5" />
      Tambah Pengeluaran
    </Link>
  );
}

export function UpdateExpense({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/pengeluaran/${id}/edit`}
      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
    >
      <Pencil className="w-5 h-5 text-blue-600 group-hover:text-blue-700" />
    </Link>
  );
}

export function DeleteExpense({ id }: { id: string }) {
  const deleteExpenseWithId = deleteExpense.bind(null, id);

  return (
    <button
      onClick={async () => {
        if (confirm('Yakin ingin menghapus pengeluaran ini?')) {
          try {
            await deleteExpenseWithId();
          } catch (error) {
            alert('Gagal menghapus pengeluaran');
          }
        }
      }}
      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
    >
      <Trash2 className="w-5 h-5 text-red-600 group-hover:text-red-700" />
    </button>
  );
}
