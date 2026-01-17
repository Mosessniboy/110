// app/ui/laporan/cashflow-chart.tsx

'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/app/lib/utils';

type CashFlowData = {
  name: string;
  revenue: number;
  expense: number;
  hpp: number;
  netIncome: number;
};

export function CashFlowChart({ data }: { data: CashFlowData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#666', fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fill: '#666', fontSize: 12 }}
          tickLine={false}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
            return value;
          }}
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="circle"
        />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#10b981" 
          strokeWidth={3}
          name="Pendapatan"
          dot={{ fill: '#10b981', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="expense" 
          stroke="#ef4444" 
          strokeWidth={3}
          name="Pengeluaran"
          dot={{ fill: '#ef4444', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="netIncome" 
          stroke="#ec4899" 
          strokeWidth={3}
          name="Net Income"
          dot={{ fill: '#ec4899', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CashFlowBarChart({ data }: { data: CashFlowData[] }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#666', fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fill: '#666', fontSize: 12 }}
          tickLine={false}
          tickFormatter={(value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}jt`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}rb`;
            return value;
          }}
        />
        <Tooltip 
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px'
          }}
        />
        <Legend 
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="square"
        />
        <Bar dataKey="revenue" fill="#10b981" name="Pendapatan" radius={[8, 8, 0, 0]} />
        <Bar dataKey="hpp" fill="#f59e0b" name="HPP" radius={[8, 8, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" name="Pengeluaran" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}