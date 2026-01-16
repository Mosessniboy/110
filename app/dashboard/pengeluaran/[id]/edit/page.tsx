// app/dashboard/pengeluaran/[id]/edit/page.tsx

import { fetchExpenseById } from '@/app/lib/data';
import EditExpenseForm from '@/app/ui/pengeluaran/edit-form';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Pengeluaran',
};

export default async function EditPengeluaranPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ FIX: params adalah Promise
}) {
  // ✅ FIX: Await params dulu
  const { id } = await params;
  
  const expense = await fetchExpenseById(id);

  if (!expense) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <EditExpenseForm expense={expense} />
    </div>
  );
}