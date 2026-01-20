import { formatCurrency } from '@/app/lib/utils';
import {
  Banknote,
  ShoppingBag,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  LucideIcon,
  DollarSign,
  Wallet,
} from 'lucide-react';

type SummaryData = {
  totalRevenue: number;
  revenueGrowth: number;
  totalTransactions: number;
  transactionGrowth: number;
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

      {/* GRID DINAMIS – CARD BOLEH MEMANJANG */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, max-content))',
        }}
      >
        <Card
          title="Total Pendapatan"
          value={formatCurrency(data.totalRevenue)}
          growth={data.revenueGrowth}
          icon={Banknote}
          colorClass="text-green-600"
        />

        <Card
          title="Gross Profit"
          value={formatCurrency(data.grossProfit)}
          growth={data.grossProfitGrowth}
          icon={DollarSign}
          subtitle={`Margin: ${data.profitMargin.toFixed(1)}%`}
          colorClass="text-blue-600"
        />

        <Card
          title="Total Pengeluaran"
          value={formatCurrency(data.totalExpense)}
          growth={data.expenseGrowth}
          icon={TrendingDown}
          colorClass="text-red-600"
        />

        <Card
          title="Net Income"
          value={formatCurrency(data.netIncome)}
          growth={data.netIncomeGrowth}
          icon={Wallet}
          subtitle={`Net Margin: ${data.netMargin.toFixed(1)}%`}
          colorClass="text-pink-600"
        />

        <Card
          title="Total Transaksi"
          value={`${data.totalTransactions}`}
          growth={data.transactionGrowth}
          icon={ShoppingBag}
          colorClass="text-purple-600"
        />

        <Card
          title="Rata-rata Transaksi"
          value={formatCurrency(data.avgTransaction)}
          growth={data.avgGrowth}
          icon={Activity}
          colorClass="text-teal-600"
        />
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  growth,
  icon: Icon,
  subtitle,
  colorClass = 'text-pink-600',
}: CardProps) {
  const isPositive = growth > 0;
  const isNeutral = growth === 0;

  let TrendIcon = Minus;
  let growthColorClass = 'text-gray-500';
  let prefix = '';

  if (isPositive) {
    TrendIcon = TrendingUp;
    growthColorClass = 'text-green-600';
    prefix = '+';
  } else if (growth < 0) {
    TrendIcon = TrendingDown;
    growthColorClass = 'text-red-500';
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 w-max">
      {/* HEADER */}
      <div className="flex items-center gap-2 text-gray-500 text-xs mb-3 whitespace-nowrap">
        <Icon className="w-4 h-4" />
        <span className="font-medium">{title}</span>
      </div>

      {/* VALUE – TIDAK BOLEH TURUN BARIS */}
      <p
        className={`text-lg sm:text-xl lg:text-2xl font-bold ${colorClass} mb-1 whitespace-nowrap`}
      >
        {value}
      </p>

      {/* SUBTITLE */}
      {subtitle && (
        <p className="text-xs text-gray-600 font-medium mb-2 whitespace-nowrap">
          {subtitle}
        </p>
      )}

      {/* GROWTH */}
      <div
        className={`text-xs font-medium flex items-center gap-1 ${growthColorClass} whitespace-nowrap`}
      >
        <TrendIcon className="w-3 h-3" />
        <span>
          {isNeutral ? 'Stabil' : `${prefix}${growth.toFixed(1)}% dari tahun lalu`}
        </span>
      </div>
    </div>
  );
}
