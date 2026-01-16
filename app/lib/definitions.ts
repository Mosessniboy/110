import { LucideIcon } from 'lucide-react';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type CustomerStatus = 'hot' | 'warm' | 'cool' | 'cold';

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  transaction_frequency: number; 
  total_spent: number;          
};

export type StockStatus = 'aman' | 'rendah' | 'kritis';

export type Stock = {
  id: string;
  name: string;
  unit: 'gram' | 'ml' | 'pcs' | 'lembar';
  stock: number;
  min_stock: number;
  cost_per_unit: number;
};

export type RecipeItem = {
  stock_id: string;
  stock_name: string;
  unit: string;
  amount_needed: number;
  hpp?: number;
  cost_per_unit?: number;
};

export type Menu = {
  id: string;
  name: string;
  description: string;
  price: number;
  sold_count: number;
  is_deleted: boolean;
  recipes?: RecipeItem[]; 
  hpp?: number;
};

export type TransactionItem = {
  menu_id: string;        // TAMBAHKAN INI
  menu_name: string;
  quantity: number;
  price: number;
  subtotal: number;
};

export type Transaction = {
  id: string;
  customer_name: string; 
  customer_id?: string;
  customer_phone?: string; 
  total_amount: number;
  ongkir?: number;
  discount_percentage?: number;  // 0 atau 5 (persentase)
  discount_amount?: number;
  date: string; 
  items?: TransactionItem[]; 
};

export type DashboardData = {
  revenue: number;
  revenueGrowth: number;
  transactions: number;
  txGrowth: number;
  customers: number;
  customerGrowth: number;
  avgTx: number;
  avgGrowth: number;
};

export type CardProps = {
  title: string;
  value: string;
  sub: string;
  growth: number;
  icon: LucideIcon; 
};

// Tambahkan di app/lib/definitions.ts

export type Expense = {
  id: string;
  category: string;
  amount: number;
  description?: string;
  payment_method?: string;
  expense_date: string;
  created_at: string;
};

export const EXPENSE_CATEGORIES = [
  '🔌 Listrik',
  '💧 Air',
  '📱 Internet/Telepon',
  '🏠 Sewa Tempat',
  '👤 Gaji Karyawan',
  '🛍️ Belanja Bahan Baku',
  '🚚 Transportasi/Bensin',
  '🧹 Kebersihan',
  '📦 Kemasan',
  '📝 ATK',
  '🎯 Marketing',
  '🔧 Perbaikan',
  '💳 Lain-lain',
] as const;

export const PAYMENT_METHODS = [
  '💵 Cash',
  '💳 Transfer',
  '🏦 Debit',
  '💰 E-wallet',
] as const;