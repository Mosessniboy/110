// app/ui/dashboard/DashboardClient.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import DashboardCards from "./summary-cards";
import { WeeklySalesChart, TransactionTrendChart, TopMenuPieChart } from "./charts";
import TopCustomersTable from "./TopCustomersTable";
import { RefreshCw } from 'lucide-react';

async function fetchDashboard() {
  const res = await fetch('/api/dashboard', {
    cache: 'no-store', // ✅ Disable fetch cache juga
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch dashboard');
  }
  
  return res.json();
}

export default function DashboardClient() {
  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    refetchInterval: 10000, // 5 detik
    refetchIntervalInBackground: true,
    staleTime: 0, // ✅ Data selalu dianggap stale
    gcTime: 0, // ✅ Tidak cache di memory (previously cacheTime)
  });

  // Loading state
 

  // Error state
  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 border border-red-200 p-6">
        <h3 className="font-semibold text-red-800 mb-2">Error loading dashboard</h3>
        <p className="text-sm text-red-600 mb-4">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <button
          onClick={() => refetch()}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!data) return null;

  const topMenuFormatted = data.topMenu.map((item: any) => ({
    name: item.name,
    total: Number(item.sold_count),
  }));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-pink-600">Dashboard Overview</h1>
          <p className="text-sm text-gray-500">
            Pantau Performa Bisnis 110 Coffee Minggu Ini
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            {isFetching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-pink-500" />
                <span className="text-xs text-gray-400">Updating...</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-400">Live</span>
              </>
            )}
          </div>

          {/* Manual Refresh Button */}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-xs text-gray-500 hover:text-pink-600 disabled:opacity-50"
            title="Refresh Manual"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <DashboardCards data={data.cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <ChartCard title="Penjualan Mingguan" desc="7 Hari Terakhir">
          <WeeklySalesChart data={data.charts} />
        </ChartCard>

        <ChartCard title="Tren Transaksi" desc="Jumlah Transaksi Per Hari">
          <TransactionTrendChart data={data.charts} />
        </ChartCard>

        <ChartCard title="Top Menu" desc="Menu Paling Banyak Dipesan">
          <TopMenuPieChart data={topMenuFormatted} />
        </ChartCard>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <TopCustomersTable initialData={data.topCustomers} />
        </div>
      </div>
    </>
  );
}

function ChartCard({ title, desc, children }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-pink-600">{title}</h3>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>
      {children}
    </div>
  );
}