// app/ui/laporan/stock-usage-card.tsx
// ✅ COMPONENT UI ONLY - NO DATABASE LOGIC

import { Package, TrendingDown, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

// ✅ Type definition untuk data yang diterima dari parent
type StockUsageData = {
  name: string;
  unit: string;
  totalUsed: number;
  totalCost: number;
  timesUsed: number;
  currentStock: number;
  minStock: number;
  stockStatus: 'aman' | 'rendah' | 'kritis';
};

interface StockUsageAnalysisCardProps {
  data: StockUsageData[];
}

export function StockUsageAnalysisCard({ data }: StockUsageAnalysisCardProps) {
  // Top 10 stocks
  const topStocks = data.slice(0, 10);
  
  // Calculate total cost
  const totalCost = data.reduce((sum, s) => sum + s.totalCost, 0);

  // Count critical stocks
  const criticalCount = data.filter(s => s.stockStatus === 'kritis').length;
  const lowCount = data.filter(s => s.stockStatus === 'rendah').length;

  return (
    <div className="rounded-xl border border-pink-100 bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-bold text-pink-600">
            Analisis Penggunaan Bahan Baku
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-600">Total HPP Bahan</p>
          <p className="text-xl font-bold text-pink-600">
            {formatCurrency(totalCost)}
          </p>
        </div>
      </div>

      {/* Stock List */}
      <div className="space-y-3">
        {topStocks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>Belum ada data penggunaan bahan baku</p>
          </div>
        ) : (
          topStocks.map((stock, index) => {
            const costPercentage = totalCost > 0 
              ? (stock.totalCost / totalCost) * 100 
              : 0;

            return (
              <div 
                key={stock.name}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 border border-gray-100 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Ranking Number */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 text-pink-600 font-semibold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  
                  {/* Stock Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-800 truncate">
                        {stock.name}
                      </p>
                      
                      {/* Status Icons */}
                      {stock.stockStatus === 'kritis' && (
                        <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      )}
                      {stock.stockStatus === 'rendah' && (
                        <TrendingDown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    {/* Usage Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                      <span className="whitespace-nowrap">
                        Terpakai: <span className="font-medium">{stock.totalUsed.toFixed(1)} {stock.unit}</span>
                      </span>
                      <span>•</span>
                      <span className="whitespace-nowrap">
                        Digunakan <span className="font-medium">{stock.timesUsed}x</span>
                      </span>
                      <span>•</span>
                      <span className={`whitespace-nowrap font-medium ${
                        stock.stockStatus === 'aman' ? 'text-green-600' :
                        stock.stockStatus === 'rendah' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        Stok: {stock.currentStock} {stock.unit}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cost Info */}
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="font-bold text-gray-800">
                    {formatCurrency(stock.totalCost)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {costPercentage.toFixed(1)}% dari total
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Insights Section */}
      {topStocks.length > 0 && (
        <>
          {/* Main Insight */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">💡 Insight:</span>
              {' '}Bahan <span className="font-semibold">{topStocks[0]?.name}</span> adalah yang paling banyak terpakai dengan biaya{' '}
              <span className="font-semibold">{formatCurrency(topStocks[0]?.totalCost || 0)}</span>
              {' '}({((topStocks[0]?.totalCost || 0) / totalCost * 100).toFixed(1)}% dari total HPP).
            </p>
          </div>

          {/* Critical Stock Warning */}
          {criticalCount > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    ⚠️ Perhatian: Stok Kritis!
                  </p>
                  <p className="text-sm text-red-800">
                    {criticalCount} bahan baku dalam status <span className="font-semibold">kritis</span>
                    {lowCount > 0 && ` dan ${lowCount} bahan baku dalam status rendah`}.
                    {' '}Segera lakukan restock untuk menghindari kehabisan bahan!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Low Stock Warning (only if no critical) */}
          {criticalCount === 0 && lowCount > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 mb-1">
                    📊 Stok Mendekati Minimum
                  </p>
                  <p className="text-sm text-yellow-800">
                    {lowCount} bahan baku mendekati stok minimum. 
                    Pertimbangkan untuk melakukan restock dalam waktu dekat.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* All Good Message */}
          {criticalCount === 0 && lowCount === 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800">
                  <span className="font-semibold">✅ Stok Aman:</span>
                  {' '}Semua bahan baku dalam kondisi baik. Lanjutkan monitoring rutin.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}