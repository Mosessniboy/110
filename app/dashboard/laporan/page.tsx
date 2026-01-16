// app/dashboard/laporan/page.tsx
// ✅ FIXED: Proper async searchParams handling for Next.js 15
import { fetchExpenseSummary } from '@/app/lib/data';

import { 
  fetchReportSummary, 
  fetchMonthlyProfitData,
  fetchMenuAnalysis,
  fetchPeakHoursData,
  fetchCustomerMetrics,
  fetchRevenueChartData,
  fetchTransactionTrendData,
  fetchStockUsageAnalysis
} from '@/app/lib/data';
import SummaryCards from '@/app/ui/laporan/summary-cards';
import { 
  MonthlyProfitChart,
  MenuAnalysisChart,
  PeakHoursChart,
  AOVTrendChart,
  RevenueChart,
  TransactionChart
} from '@/app/ui/laporan/charts';
import {
  CustomerRetentionCard,
  TopMenuPerformanceCard,
  PeakHoursSummaryCard
} from '@/app/ui/laporan/matrikcard';
import { StockUsageAnalysisCard } from '@/app/ui/laporan/stock-usage-card';
import { BarChart3, TrendingUp, Coffee, Clock, Package, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import YearSelector from '@/app/ui/laporan/YearSelector';
import { formatCurrency } from '@/app/lib/utils';

// ✅ FIX: Props type untuk Next.js 15
type PageProps = {
  searchParams: Promise<{ year?: string }>;  // ✅ Now it's a Promise!
};

export default async function LaporanPage(props: PageProps) {
  // ✅ FIX: Await searchParams (Next.js 15 requirement)
  const searchParams = await props.searchParams;
  
  const currentYear = new Date().getFullYear();
  const selectedYear = searchParams?.year 
    ? parseInt(searchParams.year, 10) 
    : currentYear;

  // ✅ Validasi: Handle NaN
  const validYear = isNaN(selectedYear) ? currentYear : selectedYear;

  console.log('📅 [Laporan Page] Selected Year:', validYear);
  console.log('🔍 [Laporan Page] Search Params:', searchParams);

  // Fetch all data
  const [
    summary,
    profitData,
    menuAnalysis,
    peakHours,
    customerMetrics,
    revenueData,
    transactionData,
    stockUsage
  ] = await Promise.all([
    fetchReportSummary(validYear),
    fetchMonthlyProfitData(validYear),
    fetchMenuAnalysis(validYear),
    fetchPeakHoursData(validYear),
    fetchCustomerMetrics(validYear),
    fetchRevenueChartData(validYear),
    fetchTransactionTrendData(validYear),
    fetchStockUsageAnalysis(validYear)
  ]);

  // ✅ Debug log untuk verify data fetch
  console.log('📊 [Laporan Page] Summary Data:', {
    revenue: summary.totalRevenue,
    profit: summary.netProfit,
    margin: summary.profitMargin
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-pink-600">Laporan Bisnis</h1>
          <p className="text-gray-600 mt-1">
            Analisis lengkap performa bisnis tahun {validYear}
          </p>
        </div>

        {/* Year Selector */}
        <YearSelector defaultYear={validYear} />
      </div>

      {/* 1. SUMMARY CARDS */}
      <SummaryCards data={summary} />

      {/* 2. PROFIT ANALYSIS */}
      <div className="rounded-xl border border-pink-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-bold text-pink-600">
            Analisis Profit Bulanan (Revenue vs HPP)
          </h2>
        </div>
        <MonthlyProfitChart data={profitData} />
        
        {/* Quick Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-green-700 mb-1">Total Profit Tahun Ini</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(
                profitData.reduce((sum, m) => sum + m.profit, 0)
              )}
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-700 mb-1">Rata-rata Margin</p>
            <p className="text-2xl font-bold text-blue-600">
              {(() => {
                const monthsWithData = profitData.filter(m => m.revenue > 0);
                const avgMargin = monthsWithData.length > 0
                  ? monthsWithData.reduce((sum, m) => sum + m.margin, 0) / monthsWithData.length
                  : 0;
                return avgMargin.toFixed(1);
              })()}%
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="text-sm text-purple-700 mb-1">Bulan Terbaik</p>
            <p className="text-2xl font-bold text-purple-600">
              {profitData.length > 0 
                ? profitData.reduce((max, m) => m.profit > max.profit ? m : max, profitData[0]).name
                : '-'
              }
            </p>
          </div>
        </div>
      </div>

      {/* 3. MENU ANALYSIS & CUSTOMER RETENTION */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TopMenuPerformanceCard data={menuAnalysis} />
        <CustomerRetentionCard data={customerMetrics} />
      </div>

      {/* 4. MENU ANALYSIS CHART */}
      <div className="rounded-xl border border-pink-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Coffee className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-bold text-pink-600">
            Analisis Menu: Penjualan vs Margin
          </h2>
        </div>
        <MenuAnalysisChart data={menuAnalysis} />
      </div>

      {/* 5. PEAK HOURS ANALYSIS */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-pink-100 bg-white p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-pink-600" />
            <h2 className="text-lg font-bold text-pink-600">
              Analisis Jam Operasional
            </h2>
          </div>
          <PeakHoursChart data={peakHours} />
        </div>
        
        <PeakHoursSummaryCard data={peakHours} />
      </div>

      {/* 6. AOV TREND */}
      <div className="rounded-xl border border-pink-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-bold text-pink-600">
            Tren Average Order Value
          </h2>
        </div>
        <AOVTrendChart data={customerMetrics.monthlyAOV} />
        
        <div className="mt-4 p-4 bg-pink-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-pink-600">💡 Insight:</span>
            {' '}AOV rata-rata tahun ini adalah{' '}
            <span className="font-bold">
              {formatCurrency(
                customerMetrics.monthlyAOV.reduce((sum, m) => sum + m.aov, 0) / 
                customerMetrics.monthlyAOV.filter(m => m.aov > 0).length || 1
              )}
            </span>
            {' '}per transaksi
          </p>
        </div>
      </div>

      {/* 7. STOCK USAGE ANALYSIS */}
      <StockUsageAnalysisCard data={stockUsage} />

      {/* 8. REVENUE & TRANSACTION */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-pink-100 bg-white p-6">
          <h2 className="text-lg font-bold text-pink-600 mb-4">
            Pendapatan Bulanan
          </h2>
          <RevenueChart data={revenueData} />
        </div>

        <div className="rounded-xl border border-pink-100 bg-white p-6">
          <h2 className="text-lg font-bold text-pink-600 mb-4">
            Tren Transaksi
          </h2>
          <TransactionChart data={transactionData} />
        </div>
      </div>

      {/* 9. ACTIONABLE INSIGHTS */}
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-4">
          💡 Rekomendasi Aksi
        </h3>
        <div className="space-y-3">
          {generateInsights(summary, menuAnalysis, peakHours, customerMetrics)}
        </div>
      </div>
    </div>
  );
}

// Helper function untuk generate insights
function generateInsights(
  summary: any,
  menuAnalysis: any[],
  peakHours: any[],
  customerMetrics: any
) {
  const insights = [];

  // 1. Profit Margin Check
  if (summary.profitMargin < 30) {
    insights.push(
      <div key="margin" className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-800">Margin Rendah</p>
          <p className="text-sm text-red-700">
            Profit margin Anda {summary.profitMargin.toFixed(1)}% lebih rendah dari standar industri F&B (30-40%). 
            Pertimbangkan untuk menaikkan harga atau mengurangi HPP.
          </p>
        </div>
      </div>
    );
  } else {
    insights.push(
      <div key="margin-good" className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-800">Margin Sehat</p>
          <p className="text-sm text-green-700">
            Profit margin {summary.profitMargin.toFixed(1)}% sudah di atas standar industri. Pertahankan!
          </p>
        </div>
      </div>
    );
  }

  // 2. Low Margin Menu
  const lowMarginMenus = menuAnalysis.filter(m => m.margin < 40 && m.sold > 10).slice(0, 3);
  if (lowMarginMenus.length > 0) {
    insights.push(
      <div key="low-margin" className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-800">Menu Margin Rendah</p>
          <p className="text-sm text-yellow-700">
            Menu berikut memiliki margin di bawah 40%:{' '}
            <span className="font-semibold">{lowMarginMenus.map(m => m.name).join(', ')}</span>
            . Evaluasi harga jual atau resep untuk meningkatkan profitabilitas.
          </p>
        </div>
      </div>
    );
  }

  // 3. Peak Hours Optimization
  const sortedHours = [...peakHours].sort((a, b) => b.transactions - a.transactions);
  const peakHour = sortedHours[0];
  if (peakHour && peakHour.transactions > 0) {
    insights.push(
      <div key="peak" className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Optimasi Jam Ramai</p>
          <p className="text-sm text-blue-700">
            <span className="font-semibold">{peakHour.hour}</span> adalah jam tersibuk dengan{' '}
            {peakHour.transactions} transaksi. Pastikan stok dan staff mencukupi pada jam ini 
            untuk memaksimalkan penjualan.
          </p>
        </div>
      </div>
    );
  }

  // 4. Customer Retention
  if (customerMetrics.retentionRate < 50) {
    insights.push(
      <div key="retention" className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple-800">Retention Rendah</p>
          <p className="text-sm text-purple-700">
            Hanya {customerMetrics.retentionRate.toFixed(1)}% pelanggan yang kembali. 
            Pertimbangkan program loyalitas, member card, atau sistem poin untuk meningkatkan repeat purchase.
          </p>
        </div>
      </div>
    );
  } else {
    insights.push(
      <div key="retention-good" className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-800">Loyalitas Bagus</p>
          <p className="text-sm text-green-700">
            Retention rate {customerMetrics.retentionRate.toFixed(1)}% menunjukkan pelanggan puas dengan produk Anda!
          </p>
        </div>
      </div>
    );
  }

  // 5. Revenue Growth
  if (summary.revenueGrowth < 0) {
    insights.push(
      <div key="revenue" className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-800">Pendapatan Menurun</p>
          <p className="text-sm text-red-700">
            Revenue turun {Math.abs(summary.revenueGrowth).toFixed(1)}% dari tahun lalu. 
            Evaluasi strategi marketing, menu, atau pricing untuk boost penjualan.
          </p>
        </div>
      </div>
    );
  }

  return insights;
}