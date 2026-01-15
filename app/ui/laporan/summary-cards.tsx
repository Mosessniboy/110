// app/ui/laporan/summary-cards.tsx

import { formatCurrency } from '@/app/lib/utils';
import { 
  Banknote, 
  ShoppingBag, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  LucideIcon,
  DollarSign  // Icon untuk Net Profit
} from 'lucide-react';

// ✅ Updated: Tambah Net Profit & Margin
type SummaryData = {
    totalRevenue: number;
    revenueGrowth: number;
    totalTransactions: number;
    transactionGrowth: number;
    totalCustomers: number;
    customerGrowth: number;
    avgTransaction: number;
    avgGrowth: number;
    netProfit: number;           // ✅ NEW
    profitGrowth: number;        // ✅ NEW
    profitMargin: number;        // ✅ NEW (dalam %)
};

interface CardProps {
  title: string;
  value: string;
  growth: number;
  icon: LucideIcon;
  subtitle?: string;  // ✅ NEW: untuk info tambahan seperti margin %
}

export default function SummaryCards({ data }: { data: SummaryData }) {
    return (
        <div className="rounded-xl border border-pink-100 bg-pink-50/30 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-pink-600" />
                <h2 className="text-lg font-bold text-pink-600">Ringkasan Performa</h2>
            </div>

            {/* ✅ Grid 5 cards (atau bisa 2 baris: 3 atas, 2 bawah) */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                {/* Card 1: Total Revenue */}
                <Card
                    title="Total Pendapatan"
                    value={formatCurrency(data.totalRevenue)}
                    growth={data.revenueGrowth}
                    icon={Banknote}
                />

                {/* ✅ Card 2: NET PROFIT (NEW!) */}
                <Card
                    title="Profit Bersih"
                    value={formatCurrency(data.netProfit)}
                    growth={data.profitGrowth}
                    icon={DollarSign}
                    subtitle={`Margin: ${data.profitMargin.toFixed(1)}%`}
                />

                {/* Card 3: Total Transactions */}
                <Card
                    title="Total Transaksi"
                    value={`${data.totalTransactions} Transaksi`}
                    growth={data.transactionGrowth}
                    icon={ShoppingBag}
                />

                {/* Card 4: Active Customers */}
                <Card
                    title="Pelanggan Aktif"
                    value={`${data.totalCustomers} Pelanggan`}
                    growth={data.customerGrowth}
                    icon={Users}
                />

                {/* Card 5: Average Transaction */}
                <Card
                    title="Rata-rata Transaksi"
                    value={formatCurrency(data.avgTransaction)}
                    growth={data.avgGrowth}
                    icon={Activity}
                />

            </div>
        </div>
    );
}

// ✅ Updated Card component dengan subtitle support
function Card({ title, value, growth, icon: Icon, subtitle }: CardProps) {
    const isPositive = growth > 0;
    const isNeutral = growth === 0;
    const isNegative = growth < 0;

    let colorClass = "text-gray-500";
    let TrendIcon = Minus;
    let prefix = "";

    if (isPositive) {
        colorClass = "text-green-600";
        TrendIcon = TrendingUp;
        prefix = "+";
    } else if (isNegative) {
        colorClass = "text-red-500";
        TrendIcon = TrendingDown;
        prefix = "";
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            {/* Header dengan icon */}
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <Icon className="w-4 h-4" /> {title}
            </div>

            {/* Value utama */}
            <p className="text-2xl font-bold text-pink-600">{value}</p>

            {/* ✅ Subtitle (misal: Margin %) */}
            {subtitle && (
                <p className="text-xs text-gray-600 mt-1 font-medium">{subtitle}</p>
            )}

            {/* Growth indicator */}
            <p className={`text-xs font-medium mt-2 flex items-center gap-1 ${colorClass}`}>
                <TrendIcon className="w-3 h-3" />
                {isNeutral ? "Stabil" : `${prefix}${growth.toFixed(1)}% dari tahun lalu`}
            </p>
        </div>
    );
}