// app/dashboard/pengeluaran/tambah/page.tsx

import CreateExpenseForm from '@/app/ui/pengeluaran/create-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tambah Pengeluaran',
};

export default function TambahPengeluaranPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <CreateExpenseForm />
    </div>
  );
}