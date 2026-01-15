import { CustomerStatus } from './definitions';

export const formatCurrency = (amount: number | string): string => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (typeof numericAmount !== 'number' || isNaN(numericAmount)) {
    return 'Rp 0';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta"   // 👉 ini yang benar
  }).format(date);
};


export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};


export const getCustomerStatus = (frequency: number): CustomerStatus => {
  if (frequency >= 25) return 'hot';
  if (frequency >= 15) return 'warm';
  if (frequency >= 5) return 'cool';
  return 'cold';
};

// Logic penentuan status stok
export const getStockStatus = (stock: number, minStock: number): 'aman' | 'rendah' | 'kritis' => {
  const criticalThreshold = minStock * 0.5;

  if (stock < criticalThreshold) {
    return 'kritis';
  }
  if (stock >= criticalThreshold && stock <= minStock) {
    return 'rendah';
  }
  return 'aman';
};

// Format angka ribuan
export const formatNumber = (num: number) => {
  return num.toLocaleString('id-ID');
};

// ⭐ FORMAT NOMOR UNTUK WHATSAPP
// app/lib/utils.ts

export function formatPhoneForWA(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Jika dimulai dengan 0, ganti dengan 62
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.substring(1);
  }
  
  // Jika belum ada kode negara, tambahkan 62
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned;
  }
  
  return cleaned;
}

export function getGrowthLabel(growth: number): string {
  if (growth > 0) return `+${growth.toFixed(1)}%`;
  if (growth < 0) return `${growth.toFixed(1)}%`;
  return 'Stabil';
}

// Get Growth Color
export function getGrowthColor(growth: number): string {
  if (growth > 0) return 'text-green-600';
  if (growth < 0) return 'text-red-600';
  return 'text-gray-600';
}

export function generateId(prefix: string = 'ID'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;}

export function truncate(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const CHART_COLORS = {
  primary: '#db2777',      // pink-600
  secondary: '#f472b6',    // pink-400
  success: '#10b981',      // green-500
  warning: '#f59e0b',      // amber-500
  danger: '#ef4444',       // red-500
  info: '#3b82f6',         // blue-500
  purple: '#8b5cf6',       // purple-500
  gray: '#6b7280',         // gray-500
};

export const GRADIENT_COLORS = {
  pink: ['#db2777', '#f472b6', '#fda4af'],
  green: ['#10b981', '#34d399', '#6ee7b7'],
  blue: ['#3b82f6', '#60a5fa', '#93c5fd'],
  purple: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
};

// ============================================
// VALIDATION HELPERS
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Indonesian phone number: 08xx or +628xx or 628xx
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  return phoneRegex.test(phone.replace(/[\s-]/g, ''));
}

// ============================================
// ARRAY HELPERS
// ============================================

export function groupBy<T>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

export function sumBy<T>(
  array: T[],
  key: keyof T
): number {
  return array.reduce((sum, item) => {
    const value = item[key];
    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return order === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    }
    
    return 0;
  });
}

// ============================================
// EXPORT HELPERS
// ============================================

export function downloadJSON(data: any, filename: string = 'export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(
  data: any[],
  filename: string = 'export.csv',
  headers?: string[]
) {
  if (data.length === 0) return;

  const keys = headers || Object.keys(data[0]);
  const csv = [
    keys.join(','),
    ...data.map(row => 
      keys.map(key => {
        const value = row[key];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// ============================================
// DATE HELPERS
// ============================================

export function getMonthName(monthIndex: number): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[monthIndex] || '';
}

export function getShortMonthName(monthIndex: number): string {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
  ];
  return months[monthIndex] || '';
}

export function getDayName(dayIndex: number): string {
  const days = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
  ];
  return days[dayIndex] || '';
}

export function getDateRange(
  startDate: Date,
  endDate: Date
): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
}

export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function isThisWeek(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  return d >= weekStart && d <= weekEnd;
}

export function isThisMonth(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return (
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function isThisYear(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.getFullYear() === today.getFullYear();
}

// ============================================
// BUSINESS LOGIC HELPERS
// ============================================

export function calculateMargin(revenue: number, cost: number): number {
  if (revenue === 0) return 0;
  return ((revenue - cost) / revenue) * 100;
}

export function calculateMarkup(cost: number, price: number): number {
  if (cost === 0) return 0;
  return ((price - cost) / cost) * 100;
}

export function getMarginStatus(
  margin: number
): 'excellent' | 'good' | 'fair' | 'poor' {
  if (margin >= 60) return 'excellent';
  if (margin >= 40) return 'good';
  if (margin >= 20) return 'fair';
  return 'poor';
}

export function getMarginColor(margin: number): string {
  if (margin >= 60) return 'text-green-600';
  if (margin >= 40) return 'text-blue-600';
  if (margin >= 20) return 'text-yellow-600';
  return 'text-red-600';
}