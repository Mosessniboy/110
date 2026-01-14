import { fetchRevenueChartData, fetchTransactionTrendData, fetchReportSummary } from '@/app/lib/data';
import { RevenueChart, TransactionChart } from '@/app/ui/laporan/charts';
import ExportPDFButton from '@/app/ui/laporan/export-button';
import SummaryCards from '@/app/ui/laporan/summary-cards';
import YearFilter from '@/app/ui/laporan/year-filter';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laporan | 110 Coffee',
};

export default async function Page(props: { searchParams?: Promise<{ year?: string }> }) {
  const searchParams = await props.searchParams;
  const currentYear = new Date().getFullYear();
  const selectedYear = Number(searchParams?.year) || currentYear;

  const [revenueData, transactionData, summaryData] = await Promise.all([
    fetchRevenueChartData(selectedYear),
    fetchTransactionTrendData(selectedYear),
    fetchReportSummary(selectedYear)
  ]);

  return (
    <main className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pink-600">Laporan Lengkap</h1>
          <p className="text-sm text-gray-500">Analisis mendalam performa bisnis Babi Pedia</p>
        </div>
        <div className="flex gap-3">
          <YearFilter />
          <ExportPDFButton />
        </div>
      </div>
      <div id="report-content" className="space-y-6 bg-white p-6 rounded-xl border border-gray-100">
        <div className="mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">Laporan Tahunan {selectedYear}</h2>
          <p className="text-xs text-gray-500">Dicetak otomatis oleh Sistem Babi Pedia</p>
        </div>
        <SummaryCards data={summaryData} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-1">Tren Penjualan Bulanan</h3>
            <p className="text-sm text-gray-400 mb-6">Pendapatan per bulan tahun {selectedYear}</p>
            <div className="w-full">
              <RevenueChart data={revenueData} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-700 mb-1">Tren Transaksi</h3>
            <p className="text-sm text-gray-400 mb-6">Frekuensi transaksi bulanan</p>
            <div className="w-full">
              <TransactionChart data={transactionData} />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-400 pt-4 border-t">
          Dokumen Rahasia Internal - Dilarang menyebarluaskan tanpa izin.
        </div>

      </div>
    </main>
  );
}