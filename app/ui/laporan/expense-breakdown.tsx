// app/ui/laporan/expense-breakdown.tsx

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/app/lib/utils';
import { Package } from 'lucide-react';

type ExpenseCategory = {
  category: string;
  total: number;
  count: number;
};

const COLORS = [
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#ef4444', // Red
  '#14b8a6', // Teal
  '#f97316', // Orange-red
  '#a855f7', // Violet
  '#06b6d4', // Cyan
];

export default function ExpenseBreakdownCard({ data }: { data: ExpenseCategory[] }) {
  const totalExpense = data.reduce((sum, item) => sum + item.total, 0);

  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
    percentage: totalExpense > 0 ? (item.total / totalExpense) * 100 : 0,
  }));

  // ✅ Custom label function dengan proper typing
  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(1)}%`;
  };

  return (
    <div className="rounded-xl border border-pink-100 bg-white p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-5 h-5 text-pink-600" />
        <h2 className="text-lg font-bold text-pink-600">
          Breakdown Pengeluaran per Kategori
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}  // ✅ Use custom label function
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* List Detail */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <div 
              key={item.category}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div>
                  <p className="font-semibold text-gray-800">{item.category}</p>
                  <p className="text-xs text-gray-500">{item.count} transaksi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-pink-600">{formatCurrency(item.total)}</p>
                <p className="text-xs text-gray-500">
                  {totalExpense > 0 ? ((item.total / totalExpense) * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700">Total Pengeluaran:</span>
          <span className="text-2xl font-bold text-pink-600">
            {formatCurrency(totalExpense)}
          </span>
        </div>
      </div>
    </div>
  );
}