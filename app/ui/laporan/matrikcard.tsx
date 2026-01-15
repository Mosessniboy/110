// Tambahkan komponen-komponen ini ke laporan Anda

import { Users, Repeat, UserPlus, Coffee, TrendingUp, Clock } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

// ============================================
// 1. CUSTOMER RETENTION METRICS
// ============================================
export function CustomerRetentionCard({ 
  data 
}: { 
  data: {
    retentionRate: number;
    totalCustomers: number;
    returningCustomers: number;
    newCustomers: number;
  }
}) {
  return (
    <div className="rounded-xl border border-pink-100 bg-pink-50/30 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Repeat className="w-5 h-5 text-pink-600" />
        <h2 className="text-lg font-bold text-pink-600">Loyalitas Pelanggan</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricBox
          label="Retention Rate"
          value={`${data.retentionRate.toFixed(1)}%`}
          icon={Repeat}
          color="text-green-600"
          bgColor="bg-green-50"
        />
        <MetricBox
          label="Total Pelanggan"
          value={data.totalCustomers}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <MetricBox
          label="Pelanggan Lama"
          value={data.returningCustomers}
          icon={Repeat}
          color="text-purple-600"
          bgColor="bg-purple-50"
        />
        <MetricBox
          label="Pelanggan Baru"
          value={data.newCustomers}
          icon={UserPlus}
          color="text-orange-600"
          bgColor="bg-orange-50"
        />
      </div>
    </div>
  );
}

// ============================================
// 2. TOP MENU PERFORMANCE
// ============================================
export function TopMenuPerformanceCard({ 
  data 
}: { 
  data: Array<{
    name: string;
    sold: number;
    revenue: number;
    profit: number;
    margin: number;
  }>
}) {
  // Ambil top 5
  const topData = data.slice(0, 5);

  return (
    <div className="rounded-xl border border-pink-100 bg-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <Coffee className="w-5 h-5 text-pink-600" />
        <h2 className="text-lg font-bold text-pink-600">Performa Menu Terbaik</h2>
      </div>

      <div className="space-y-4">
        {topData.map((menu, index) => (
          <div 
            key={menu.name}
            className="flex items-center justify-between p-4 rounded-lg bg-pink-50/50 border border-pink-100"
          >
            <div className="flex items-center gap-4">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full font-bold
                ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                  index === 1 ? 'bg-gray-100 text-gray-700' : 
                  index === 2 ? 'bg-orange-100 text-orange-700' : 
                  'bg-pink-100 text-pink-700'}
              `}>
                #{index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{menu.name}</p>
                <p className="text-sm text-gray-500">{menu.sold} porsi terjual</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-pink-600">{formatCurrency(menu.profit)}</p>
              <p className={`text-sm font-medium ${
                menu.margin >= 60 ? 'text-green-600' : 
                menu.margin >= 40 ? 'text-yellow-600' : 
                'text-red-600'
              }`}>
                Margin: {menu.margin.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// 3. PEAK HOURS SUMMARY
// ============================================
export function PeakHoursSummaryCard({ 
  data 
}: { 
  data: Array<{ hour: string; transactions: number; revenue: number }>
}) {
  // Cari 3 jam tersibuk
  const sortedData = [...data].sort((a, b) => b.transactions - a.transactions);
  const topHours = sortedData.slice(0, 3);

  const totalDayTransactions = data.reduce((sum, d) => sum + d.transactions, 0);

  return (
    <div className="rounded-xl border border-pink-100 bg-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-pink-600" />
        <h2 className="text-lg font-bold text-pink-600">Jam Ramai</h2>
      </div>

      <div className="space-y-3">
        {topHours.map((hour, index) => {
          const percentage = totalDayTransactions > 0 
            ? (hour.transactions / totalDayTransactions) * 100 
            : 0;

          return (
            <div key={hour.hour} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`
                    text-2xl font-bold
                    ${index === 0 ? 'text-pink-600' : 'text-gray-400'}
                  `}>
                    {hour.hour}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {hour.transactions} transaksi
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(hour.revenue)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-pink-600">
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-pink-600' : 'bg-pink-300'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-pink-600">
            {topHours[0]?.hour}
          </span>
          {' '}adalah jam tersibuk dengan{' '}
          <span className="font-semibold">
            {topHours[0]?.transactions} transaksi
          </span>
        </p>
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENT
// ============================================
function MetricBox({ 
  label, 
  value, 
  icon: Icon, 
  color, 
  bgColor 
}: { 
  label: string; 
  value: string | number; 
  icon: any; 
  color: string; 
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} p-4 rounded-lg border border-gray-100`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <p className="text-xs text-gray-600">{label}</p>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}