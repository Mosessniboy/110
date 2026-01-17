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
  DollarSign,
  TrendingDown as ExpenseIcon,
  Wallet
} from 'lucide-react';

type SummaryData = {
    totalRevenue: number;
    revenueGrowth: number;
    totalTransactions: number;
    transactionGrowth: number;
    totalCustomers: number;
    customerGrowth: number;
    avgTransaction: number;
    avgGrowth: number;
    grossProfit: number;
    grossProfitGrowth: number;
    profitMargin: number;
    totalExpense: number;
    expenseGrowth: number;
    netIncome: number;
    netIncomeGrowth: number;
    netMargin: number;
};

interface CardProps {
  title: string;
  value: string;
  growth: number;
  icon: LucideIcon;
  subtitle?: string;
  colorClass?: string;
}

export default function SummaryCards({ data }: { data: SummaryData }) {
    return (
        <div className="rounded-xl border border-pink-100 bg-pink-50/30 p-6">
            <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-pink-600" />
                <h2 className="text-lg font-bold text-pink-600">Ringkasan Performa</h2>
            </div>

            {/* ✅ Improved Grid Layout */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {/* Card 1: Total Revenue */}
                <Card
                    title="Total Pendapatan"
                    value={formatCurrency(data.totalRevenue)}
                    growth={data.revenueGrowth}
                    icon={Banknote}
                    colorClass="text-green-600"
                />

                {/* Card 2: Gross Profit */}
                <Card
                    title="Gross Profit"
                    value={formatCurrency(data.grossProfit)}
                    growth={data.grossProfitGrowth}
                    icon={DollarSign}
                    subtitle={`Margin: ${data.profitMargin.toFixed(1)}%`}
                    colorClass="text-blue-600"
                />

                {/* Card 3: Total Pengeluaran */}
                <Card
                    title="Total Pengeluaran"
                    value={formatCurrency(data.totalExpense)}
                    growth={data.expenseGrowth}
                    icon={ExpenseIcon}
                    colorClass="text-red-600"
                />

                {/* Card 4: Net Income */}
                <Card
                    title="Net Income"
                    value={formatCurrency(data.netIncome)}
                    growth={data.netIncomeGrowth}
                    icon={Wallet}
                    subtitle={`Net Margin: ${data.netMargin.toFixed(1)}%`}
                    colorClass="text-pink-600"
                />

                {/* Card 5: Total Transactions */}
                <Card
                    title="Total Transaksi"
                    value={`${data.totalTransactions}`}
                    growth={data.transactionGrowth}
                    icon={ShoppingBag}
                    colorClass="text-purple-600"
                />

                {/* Card 6: Active Customers */}
                <Card
                    title="Pelanggan Aktif"
                    value={`${data.totalCustomers}`}
                    growth={data.customerGrowth}
                    icon={Users}
                    colorClass="text-orange-600"
                />
            </div>

            {/* ✅ Row 2: Average Transaction (full width or centered) */}
            <div className="grid gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card
                    title="Rata-rata Transaksi"
                    value={formatCurrency(data.avgTransaction)}
                    growth={data.avgGrowth}
                    icon={Activity}
                    colorClass="text-teal-600"
                />
                {/* Empty spacers for alignment */}
                <div className="hidden xl:block"></div>
                <div className="hidden xl:block"></div>
                <div className="hidden xl:block"></div>
                <div className="hidden xl:block"></div>
                <div className="hidden xl:block"></div>
            </div>
        </div>
    );
}

function Card({ title, value, growth, icon: Icon, subtitle, colorClass = "text-pink-600" }: CardProps) {
    const isPositive = growth > 0;
    const isNeutral = growth === 0;
    const isNegative = growth < 0;

    let growthColorClass = "text-gray-500";
    let TrendIcon = Minus;
    let prefix = "";

    if (isPositive) {
        growthColorClass = "text-green-600";
        TrendIcon = TrendingUp;
        prefix = "+";
    } else if (isNegative) {
        growthColorClass = "text-red-500";
        TrendIcon = TrendingDown;
        prefix = "";
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            {/* Header dengan icon */}
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-3">
                <Icon className="w-4 h-4" />
                <span className="font-medium">{title}</span>
            </div>

            {/* Value utama */}
            <p className={`text-xl lg:text-2xl font-bold ${colorClass} mb-1 truncate`}>
                {value}
            </p>

            {/* Subtitle (margin %) */}
            {subtitle && (
                <p className="text-xs text-gray-600 font-medium mb-2">{subtitle}</p>
            )}

            {/* Growth indicator */}
            <div className={`text-xs font-medium flex items-center gap-1 ${growthColorClass}`}>
                <TrendIcon className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                    {isNeutral ? "Stabil" : `${prefix}${growth.toFixed(1)}% dari tahun lalu`}
                </span>
            </div>
        </div>
    );
}