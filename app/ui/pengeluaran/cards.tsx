// app/ui/pengeluaran/cards.tsx

import { TrendingDown, DollarSign, PieChart, Calendar } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

type CardData = {
  total: number;
  count: number;
  avgPerDay: number;
  topCategory: string;
  topCategoryAmount: number;
};

export default function ExpenseSummaryCards({ data }: { data: CardData }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Pengeluaran */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <TrendingDown className="w-4 h-4" />
          Total Pengeluaran Bulan Ini
        </div>
        <p className="text-2xl font-bold text-pink-600">{formatCurrency(data.total)}</p>
        <p className="text-xs text-gray-500 mt-1">{data.count} transaksi</p>
      </div>

      {/* Rata-rata per Hari */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <DollarSign className="w-4 h-4" />
          Rata-rata per Hari
        </div>
        <p className="text-2xl font-bold text-blue-600">{formatCurrency(data.avgPerDay)}</p>
        <p className="text-xs text-gray-500 mt-1">Estimasi harian</p>
      </div>

      {/* Kategori Terbanyak */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <PieChart className="w-4 h-4" />
          Kategori Terbanyak
        </div>
        <p className="text-2xl font-bold text-purple-600">{data.topCategory}</p>
        <p className="text-xs text-gray-500 mt-1">{formatCurrency(data.topCategoryAmount)}</p>
      </div>

      {/* Transaksi Terakhir */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <Calendar className="w-4 h-4" />
          Total Transaksi
        </div>
        <p className="text-2xl font-bold text-green-600">{data.count}</p>
        <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
      </div>
    </div>
  );
}