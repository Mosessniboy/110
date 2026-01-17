'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Legend, BarChart, Bar, Cell, ComposedChart
} from 'recharts';
import { formatCurrency } from '@/app/lib/utils';

// ============================================
// 1. GRAFIK PROFIT BULANAN (Revenue vs HPP vs Profit)
// ============================================
export function MonthlyProfitChart({ data }: { data: any[] }) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            yAxisId="left"
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${(value / 1000000).toFixed(1)}jt`} 
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(0)}%`}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'margin') return `${value.toFixed(1)}%`;
              return formatCurrency(value);
            }}
            labelFormatter={(label) => `Bulan: ${label}`}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              border: '1px solid #f3f4f6',
              padding: '12px'
            }}
          />
          <Legend />
          
          {/* Area untuk Revenue */}
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="revenue" 
            name="Pendapatan"
            fill="#fce7f3" 
            stroke="#db2777" 
            strokeWidth={2}
          />
          
          {/* Area untuk HPP */}
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="hpp" 
            name="HPP"
            fill="#fee2e2" 
            stroke="#ef4444" 
            strokeWidth={2}
          />
          
          {/* Line untuk Profit */}
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="profit" 
            name="Profit Bersih"
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          />
          
          {/* Line untuk Margin % */}
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="margin" 
            name="Margin %"
            stroke="#8b5cf6" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#8b5cf6' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// 2. GRAFIK ANALISIS MENU (Best Seller vs Margin)
// ============================================
export function MenuAnalysisChart({ data }: { data: any[] }) {
  // Ambil top 10 menu
  const topData = data.slice(0, 10);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart 
          data={topData} 
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis type="number" stroke="#9ca3af" fontSize={12} />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#9ca3af" 
            fontSize={11}
            width={90}
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'margin') return `${value.toFixed(1)}%`;
              if (name === 'sold') return `${value} porsi`;
              return formatCurrency(value);
            }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              border: '1px solid #f3f4f6' 
            }}
          />
          <Legend />
          
          <Bar dataKey="sold" name="Terjual" fill="#db2777" radius={[0, 8, 8, 0]} />
          <Line 
            type="monotone" 
            dataKey="margin" 
            name="Margin %"
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// 3. GRAFIK JAM RAMAI (Peak Hours)
// ============================================
export function PeakHoursChart({ data }: { data: any[] }) {
  // Filter hanya jam operasional (misal 6 pagi - 11 malam)
  const operatingHours = data.filter((_, index) => index >= 6 && index <= 23);
  
  // Cari jam dengan transaksi tertinggi
  const maxTransactions = Math.max(...operatingHours.map(d => d.transactions));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={operatingHours} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="hour" 
            stroke="#9ca3af" 
            fontSize={11} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'transactions') return `${value} transaksi`;
              return formatCurrency(value);
            }}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              border: '1px solid #f3f4f6' 
            }}
          />
          <Legend />
          
          <Bar dataKey="transactions" name="Transaksi" radius={[8, 8, 0, 0]}>
            {operatingHours.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.transactions === maxTransactions ? '#db2777' : '#fda4af'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// 4. GRAFIK AOV TREND
// ============================================
export function AOVTrendChart({ data }: { data: any[] }) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ 
              backgroundColor: '#fff', 
              borderRadius: '8px', 
              border: '1px solid #f3f4f6' 
            }}
          />
          <Line 
            type="monotone" 
            dataKey="aov" 
            name="Rata-rata Per Transaksi"
            stroke="#db2777" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#db2777', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ============================================
// CHART LAMA (Revenue & Transaction)
// ============================================
export function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#db2777" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}jt`} 
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6' }}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#db2777" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTotal)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TransactionChart({ data }: { data: any[] }) {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #f3f4f6' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="count" 
            name="Jumlah Transaksi"
            stroke="#db2777" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#db2777', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Di bagian export, tambahkan:

export { CashFlowChart, CashFlowBarChart } from './cashflow-chart';
export { default as ExpenseBreakdownCard } from './expense-breakdown';