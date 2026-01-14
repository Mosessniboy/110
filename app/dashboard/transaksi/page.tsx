// app/dashboard/transaksi/page.tsx

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { auth } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import { fetchTransactions, fetchTransactionCounts } from '@/app/lib/data';
import TransactionTable from '@/app/ui/transaksi/table';
import TransactionCards from '@/app/ui/transaksi/cards';
import Search from '@/app/ui/search';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Transaksi | 110 Coffee',
  description: 'Halaman untuk mengelola dan memantau transaksi penjualan dalam sistem.',
};

export default async function Page(props: { 
  searchParams?: Promise<{ query?: string; error?: string }> 
}) {
  // 🔒 CEK AUTH DULU
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  const userRole = session.user.role || 'staff';

  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const error = searchParams?.error;

  const [transactions, counts] = await Promise.all([
    fetchTransactions(query),
    fetchTransactionCounts(),
  ]);

  return (
    <div className="w-full space-y-6">
      
      {/* Error Alert - Akses Ditolak */}
      {error === 'access_denied' && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⛔</span>
            <div>
              <h3 className="font-semibold text-red-800">Akses Ditolak</h3>
              <p className="text-sm text-red-700 mt-1">
                Hanya Admin yang dapat mengedit atau menghapus transaksi.
              </p>
            </div>
          </div>
        </div>
      )}

      <TransactionCards data={counts} />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-xl font-bold text-pink-600">
                  Riwayat Transaksi
                  {userRole === 'staff' && (
                    <span className="ml-3 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      📋 Mode Staff (Lihat & Buat Saja)
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-500">Kelola dan pantau semua transaksi penjualan</p>
            </div>
            
            <Link 
                href="/dashboard/transaksi/create" 
                className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-500"
            >
               Transaksi Baru
            </Link>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
             <Search placeholder="Cari ID transaksi atau nama pelanggan..." />
        </div>
      </div>

      {/* Pass userRole ke TransactionTable */}
      <TransactionTable 
        transactions={transactions} 
        userRole={userRole}
      />
    </div>
  );
}