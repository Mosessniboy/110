// app/dashboard/laporan/page.tsx

import { 
  fetchReportSummary, 
  fetchMonthlyProfitData,
  fetchMenuAnalysis,
  fetchPeakHoursData,
  fetchCustomerMetrics,
  fetchRevenueChartData,
  fetchTransactionTrendData,
  fetchCashFlowData,
  fetchExpenseByCategory,
  fetchStockUsageAnalysis,
} from '@/app/lib/data';

import SummaryCards from '@/app/ui/laporan/summary-cards';
import { 
  MonthlyProfitChart,
  MenuAnalysisChart,
  PeakHoursChart,
  AOVTrendChart,
  RevenueChart,
  TransactionChart,
  CashFlowChart,
  ExpenseBreakdownCard,
} from '@/app/ui/laporan/charts';

import {
  CustomerRetentionCard,
  TopMenuPerformanceCard,
  PeakHoursSummaryCard
} from '@/app/ui/laporan/matrikcard';

import { StockUsageAnalysisCard } from '@/app/ui/laporan/stock-usage-card';
import { BarChart3, TrendingUp, Coffee, Clock, Wallet, Package, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import YearSelector from '@/app/ui/laporan/YearSelector';
import { formatCurrency } from '@/app/lib/utils';

type PageProps = {
  searchParams: Promise<{ year?: string }>;
};

export default async function LaporanPage(props: PageProps) {
  const searchParams = await props.searchParams;
  
  const currentYear = new Date().getFullYear();
  const selectedYear = searchParams?.year 
    ? parseInt(searchParams.year, 10) 
    : currentYear;

  const validYear = isNaN(selectedYear) ? currentYear : selectedYear;

  // Fetch all data
  const [
    summary,
    profitData,
    menuAnalysis,
    peakHours,
    customerMetrics,
    revenueData,
    transactionData,
    cashFlowData,
    expenseByCategory,
    stockUsage,
  ] = await Promise.all([
    fetchReportSummary(validYear),
    fetchMonthlyProfitData(validYear),
    fetchMenuAnalysis(validYear),
    fetchPeakHoursData(validYear),
    fetchCustomerMetrics(validYear),
    fetchRevenueChartData(validYear),
    fetchTransactionTrendData(validYear),
    fetchCashFlowData(validYear),
    fetchExpenseByCategory(validYear),
    fetchStockUsageAnalysis(validYear),
  ]);

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
        <YearSelector defaultYear={validYear} />
      </div>

      {/* 1. SUMMARY CARDS */}
      <SummaryCards data={summary} />

      {/* 2. CASH FLOW ANALYSIS */}
      <div className="rounded-xl border border-pink-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-bold text-pink-600">
            Analisis Cash Flow (Pendapatan vs Pengeluaran)
          </h2>
        </div>

        <CashFlowChart data={cashFlowData} />

        {/* Quick Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <p className="text-sm text-green-700 mb-1">Total Pendapatan</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(cashFlowData.reduce((sum, m) => sum + m.revenue, 0))}
            </p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-100">
            <p className="text-sm text-red-700 mb-1">Total Pengeluaran</p>
            <p className="text-2xl font-bold text-red-600">
              {formatCurrency(cashFlowData.reduce((sum, m) => sum + m.expense, 0))}
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <p className="text-sm text-orange-700 mb-1">Total HPP</p>
            <p className="text-2xl font-bold text-orange-600">
              {formatCurrency(cashFlowData.reduce((sum, m) => sum + m.hpp, 0))}
            </p>
          </div>
          
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
            <p className="text-sm text-pink-700 mb-1">Net Income</p>
            <p className="text-2xl font-bold text-pink-600">
              {formatCurrency(cashFlowData.reduce((sum, m) => sum + m.netIncome, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* 3. EXPENSE BREAKDOWN */}
      <ExpenseBreakdownCard data={expenseByCategory} />

      {/* 4. PROFIT ANALYSIS */}
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
            <p className="text-sm text-green-700 mb-1">Total Gross Profit Tahun Ini</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(profitData.reduce((sum, m) => sum + m.profit, 0))}
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

      {/* 5. MENU ANALYSIS & CUSTOMER RETENTION */}
      <div className="grid lg:grid-cols-2 gap-6">
        <TopMenuPerformanceCard data={menuAnalysis} />
        <CustomerRetentionCard data={customerMetrics} />
      </div>

      {/* 6. MENU ANALYSIS CHART */}
      <div className="rounded-xl border border-pink-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <Coffee className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-bold text-pink-600">
            Analisis Menu: Penjualan vs Margin
          </h2>
        </div>
        <MenuAnalysisChart data={menuAnalysis} />
      </div>

      {/* 7. PEAK HOURS ANALYSIS */}
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

      {/* 8. AOV TREND */}
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
                (customerMetrics.monthlyAOV.filter(m => m.aov > 0).length || 1)
              )}
            </span>
            {' '}per transaksi
          </p>
        </div>
      </div>

      {/* 9. STOCK USAGE ANALYSIS */}
      <StockUsageAnalysisCard data={stockUsage} />

      {/* 10. REVENUE & TRANSACTION */}
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

      {/* 11. ACTIONABLE INSIGHTS */}
      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6">
        <h3 className="text-lg font-bold text-yellow-800 mb-4">
          💡 Rekomendasi Aksi
        </h3>
        <div className="space-y-3">
          {generateInsights(summary, menuAnalysis, peakHours, customerMetrics, expenseByCategory)}
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
  customerMetrics: any,
  expenseData: any[]
) {
  const insights = [];

  // 1. Net Margin Check
  if (summary.netMargin < 20) {
    insights.push(
      <div key="net-margin" className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-800">Net Margin Rendah</p>
          <p className="text-sm text-red-700">
            Net margin Anda {summary.netMargin.toFixed(1)}% setelah dikurangi semua pengeluaran. 
            Evaluasi pengeluaran operasional untuk meningkatkan profitabilitas.
          </p>
        </div>
      </div>
    );
  } else {
    insights.push(
      <div key="net-margin-good" className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-green-800">Net Margin Sehat</p>
          <p className="text-sm text-green-700">
            Net margin {summary.netMargin.toFixed(1)}% menunjukkan bisnis Anda profitable setelah semua pengeluaran!
          </p>
        </div>
      </div>
    );
  }

  // 2. Expense Control
  const expenseRatio = summary.totalRevenue > 0 
    ? (summary.totalExpense / summary.totalRevenue) * 100 
    : 0;
    
  if (expenseRatio > 30) {
    insights.push(
      <div key="expense" className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-orange-800">Pengeluaran Tinggi</p>
          <p className="text-sm text-orange-700">
            Pengeluaran operasional mencapai {expenseRatio.toFixed(1)}% dari revenue. 
            Tinjau kategori pengeluaran terbesar untuk efisiensi biaya.
          </p>
        </div>
      </div>
    );
  }

  // 3. Low Margin Menu
  const lowMarginMenus = menuAnalysis.filter(m => m.margin < 40 && m.sold > 10).slice(0, 3);
  if (lowMarginMenus.length > 0) {
    insights.push(
      <div key="low-margin" className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-800">Menu Margin Rendah</p>
          <p className="text-sm text-yellow-700">
            Menu berikut memiliki margin di bawah 40%:{' '}
            <span className="font-semibold">{lowMarginMenus.map(m => m.name).join(', ')}</span>.
          </p>
        </div>
      </div>
    );
  }

  // 4. Peak Hours
  const sortedHours = [...peakHours].sort((a, b) => b.transactions - a.transactions);
  const peakHour = sortedHours[0];
  if (peakHour && peakHour.transactions > 0) {
    insights.push(
      <div key="peak" className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-800">Optimasi Jam Ramai</p>
          <p className="text-sm text-blue-700">
            {peakHour.hour} adalah jam tersibuk. Pastikan stok dan staff mencukupi.
          </p>
        </div>
      </div>
    );
  }

  // 5. Customer Retention
  if (customerMetrics.retentionRate < 50) {
    insights.push(
      <div key="retention" className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
        <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple-800">Retention Rendah</p>
          <p className="text-sm text-purple-700">
            {customerMetrics.retentionRate.toFixed(1)}% pelanggan kembali. 
            Pertimbangkan program loyalitas.
          </p>
        </div>
      </div>
    );
  }

  return insights.length > 0 ? insights : [
    <div key="good" className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-green-700 font-semibold">✅ Performa bisnis Anda sangat baik!</p>
    </div>
  ];
}