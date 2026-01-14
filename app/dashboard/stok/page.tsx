import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { fetchStocks, fetchStockCounts } from '@/app/lib/data';
import StocksTable from '@/app/ui/stok/table';
import StockCards from '@/app/ui/stok/cards';
import Search from '@/app/ui/search';
import StatusFilter from '@/app/ui/stok/status-filter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stok Bahan Baku | 110 Coffee',
  description: 'Halaman untuk mengelola stok bahan baku dalam sistem.',
};

export default async function Page(props: {
  searchParams?: Promise<{ query?: string; status?: string }>
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const status = searchParams?.status || '';

  const [stocks, counts] = await Promise.all([
    fetchStocks(query, status),
    fetchStockCounts(),
  ]);

  return (
    <div className="w-full space-y-6">

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pink-600">Stok Bahan Baku</h1>
        <Link
          href="/dashboard/stok/create"
          className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-500"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Tambah Bahan</span>
        </Link>
      </div>

      <StockCards counts={counts} />

      <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="w-full md:flex-1">
          <Search placeholder="Cari nama bahan..." />
        </div>
        <div className="w-full md:w-48">
          <StatusFilter />
        </div>
      </div>

      <StocksTable stocks={stocks} />

      {stocks.length === 0 && (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg mt-4 border border-dashed border-gray-300">
          Tidak ada bahan baku yang ditemukan dengan filter ini.
        </div>
      )}
    </div>
  );
}