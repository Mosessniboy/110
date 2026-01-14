// import postgres from 'postgres';
import { Customer, Stock, Menu, Transaction, TransactionItem } from '@/app/lib/definitions';
import { getCustomerStatus, getStockStatus } from './utils';
import { unstable_noStore as noStore } from 'next/cache';
import sql from './db';
// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchCustomers(
  sortOrder: 'asc' | 'desc' = 'desc', 
  query: string = ''
) {
  noStore();

  try {
    const direction = sortOrder === 'asc' ? sql`ASC` : sql`DESC`;
    
    const searchPattern = `%${query}%`;

    const data = await sql<Customer[]>`
      SELECT
        id,
        name,
        phone,
        address,
        transaction_frequency,
        total_spent
      FROM customers
      WHERE
        name ILIKE ${searchPattern} OR
        phone ILIKE ${searchPattern} OR
        address ILIKE ${searchPattern}
      ORDER BY transaction_frequency ${direction}
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer data.');
  }
}

export async function fetchCustomerCounts() {
  noStore();
  try {
    const data = await sql<{ transaction_frequency: number }[]>`
      SELECT transaction_frequency FROM customers
    `;

    const counts = {
      hot: 0,
      warm: 0,
      cool: 0,
      cold: 0,
    };

    data.forEach((customer) => {
      const status = getCustomerStatus(customer.transaction_frequency);
      counts[status]++; 
    });

    return counts;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

// Replace function fetchStocks di data.ts dengan ini:

export async function fetchStocks(query: string = '', status: string = '') {
  noStore();
  try {
    const searchFilter = sql`
      (name ILIKE ${`%${query}%`})
    `;

    let statusFilter = sql``; 

    if (status === 'kritis') {
      statusFilter = sql`AND stock < (min_stock * 0.5)`;
    } else if (status === 'rendah') {
      statusFilter = sql`AND stock >= (min_stock * 0.5) AND stock <= min_stock`;
    } else if (status === 'aman') {
      statusFilter = sql`AND stock > min_stock`;
    }
    
    // ✅ TAMBAHKAN cost_per_unit di SELECT
    const data = await sql<Stock[]>`
      SELECT id, name, unit, stock, min_stock, cost_per_unit 
      FROM stocks
      WHERE ${searchFilter} ${statusFilter}
      ORDER BY name ASC
    `;

    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch stocks.');
  }
}

export async function fetchStockCounts() {
  noStore();
  try {
    const data = await sql<{ stock: number; min_stock: number }[]>`
      SELECT stock, min_stock FROM stocks
    `;

    const counts = {
      total_item: data.length,
      kritis: 0,
      rendah: 0,
      aman: 0,
    };

    if (Array.isArray(data)) {
        data.forEach((item) => {
            if (item) {
                const status = getStockStatus(Number(item.stock), Number(item.min_stock));
                counts[status]++;
            }
        });
    }

    return counts;
  } catch (error) {
    console.error('REAL DATABASE ERROR:', error);
    return {
      total_item: 0,
      kritis: 0,
      rendah: 0,
      aman: 0,
    };
  }
}

export async function fetchStockById(id: string) {
  noStore();
  try {
    const data = await sql<Stock[]>`
      SELECT * FROM stocks
      WHERE id = ${id}
    `;

    if (data.length === 0) {
      return null; 
    }

    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch stock.');
  }
}

//------------------------------------------------------------------------------------//
//-------------------------------- MENU DATA FETCHING --------------------------------//
//------------------------------------------------------------------------------------//

export async function fetchMenus(query: string = '') {
  noStore();
  try {
    const data = await sql<Menu[]>`
      SELECT 
        m.id,
        m.name,
        m.description,
        m.price::numeric as price,  -- ✅ Cast to numeric
        COALESCE(m.hpp, 0)::numeric as hpp,  -- ✅ Cast to numeric
        m.sold_count,
        m.is_deleted,
        COALESCE(
          json_agg(
            json_build_object(
              'stock_name', s.name, 
              'unit', s.unit, 
              'amount_needed', mr.amount_needed
            )
          ) FILTER (WHERE s.id IS NOT NULL), 
          '[]'
        ) as recipes
      FROM menus m
      LEFT JOIN menu_recipes mr ON m.id = mr.menu_id
      LEFT JOIN stocks s ON mr.stock_id = s.id
      WHERE 
        m.is_deleted = FALSE AND
        (m.name ILIKE ${`%${query}%`} OR m.description ILIKE ${`%${query}%`})
      GROUP BY m.id
      ORDER BY m.sold_count DESC
    `;
    
    // ✅ Ensure numbers are numbers
    return data.map(menu => ({
      ...menu,
      price: Number(menu.price),
      hpp: Number(menu.hpp || 0),
      sold_count: Number(menu.sold_count)
    }));
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchMenuCounts() {
  noStore();
  try {
    const menuCount = await sql`SELECT COUNT(*) FROM menus WHERE is_deleted = FALSE`;
    
    const soldCount = await sql`SELECT SUM(sold_count) FROM menus WHERE is_deleted = FALSE`;

    const topMenu = await sql`SELECT name, sold_count FROM menus WHERE is_deleted = FALSE ORDER BY sold_count DESC LIMIT 1`;

    let bestSellerName = "Tidak ada";
    
    if (topMenu.length > 0 && topMenu[0].sold_count > 0) {
      bestSellerName = topMenu[0].name;
    }

    return {
      total_menu: Number(menuCount[0].count),
      total_sold: Number(soldCount[0].sum) || 0,
      best_seller: bestSellerName
    };
  } catch (error) {
    console.error('Error fetching counts:', error);
    return { total_menu: 0, total_sold: 0, best_seller: '-' };
  }
}

export async function fetchStockList() {
  noStore();
  const data = await sql<Stock[]>`SELECT id, name, unit, stock FROM stocks ORDER BY name ASC`;
  return data;
}

export async function fetchMenuById(id: string) {
  noStore();
  try {
    const data = await sql<Menu[]>`
      SELECT 
        m.id, m.name, m.description, m.price, m.sold_count, m.is_deleted,
        COALESCE(
          json_agg(
            json_build_object(
              'stock_id', s.id,
              'stock_name', s.name, 
              'unit', s.unit, 
              'amount_needed', mr.amount_needed
            )
          ) FILTER (WHERE s.id IS NOT NULL), 
          '[]'
        ) as recipes
      FROM menus m
      LEFT JOIN menu_recipes mr ON m.id = mr.menu_id
      LEFT JOIN stocks s ON mr.stock_id = s.id
      WHERE m.id = ${id}
      GROUP BY m.id
    `;
    return data[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch menu.');
  }
}

//------------------------------------------------------------------------------------//
//-------------------------------- Transaction DATA FETCHING -------------------------//
//------------------------------------------------------------------------------------//

export async function fetchTransactionCounts() {
  noStore();
  try {
    const count = await sql`SELECT COUNT(*) FROM transactions`;
    const total = await sql`SELECT SUM(total_amount) FROM transactions`;
    return {
      count: Number(count[0].count),
      total_revenue: Number(total[0].sum) || 0,
    };
  } catch { 
    return { count: 0, total_revenue: 0 };
  }
}

export async function fetchTransactions(query: string = '') {
  noStore();
  try {
    const data = await sql<Transaction[]>`
      SELECT 
        t.id,
        t.total_amount,
        t.created_at as date,
        COALESCE(c.name, 'Umum / Guest') as customer_name
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      WHERE 
        t.id ILIKE ${`%${query}%`} OR
        c.name ILIKE ${`%${query}%`}
      ORDER BY t.created_at DESC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch transactions.');
  }
}

// Update di data.ts (atau tempat Anda menyimpan fungsi fetch)

// app/lib/data.ts

export async function fetchTransactionById(id: string): Promise<Transaction> {
  if (!id || typeof id !== 'string') {
    throw new Error('ID transaksi tidak valid');
  }

  const result = await sql`
    SELECT 
      t.id,
      t.customer_id,
      t.total_amount,
      t.ongkir,  -- ✅ TAMBAHKAN INI
      t.discount_percentage,
      t.discount_amount,
      t.created_at as date,
      COALESCE(c.name, 'Guest') as customer_name,
      c.phone as customer_phone
    FROM transactions t
    LEFT JOIN customers c ON t.customer_id = c.id
    WHERE t.id = ${id}
  `;

  if (result.length === 0) {
    throw new Error('Transaksi tidak ditemukan');
  }

  const items = await sql`
    SELECT 
      ti.menu_id,
      m.name as menu_name,
      ti.quantity,
      ti.price_at_time as price,
      ti.subtotal
    FROM transaction_items ti
    JOIN menus m ON ti.menu_id = m.id
    WHERE ti.transaction_id = ${id}
  `;

  return {
    id: result[0].id,
    customer_id: result[0].customer_id,
    customer_name: result[0].customer_name,
    customer_phone: result[0].customer_phone || '',
    total_amount: result[0].total_amount,
    ongkir: result[0].ongkir || 0,  // ✅ TAMBAHKAN INI
    discount_percentage: result[0].discount_percentage || 0,
    discount_amount: result[0].discount_amount || 0,
    date: result[0].date,
    items: items.map((item) => ({
      menu_id: item.menu_id,
      menu_name: item.menu_name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    })),
  };
}

export async function fetchMenusForPOS() {
  noStore();
  const data = await sql<Menu[]>`
    SELECT id, name, price, description 
    FROM menus 
    WHERE is_deleted = FALSE 
    ORDER BY name ASC
  `;
  return data;
}

export async function fetchCustomersForPOS() {
  noStore();
  try {
    const data = await sql<{ id: string; name: string; transaction_frequency: number }[]>`
      SELECT id, name, transaction_frequency 
      FROM customers 
      ORDER BY name ASC
    `;
    return data;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

//------------------------------------------------------------------------------------//
//-------------------------------- Laporan DATA FETCHING -----------------------------//
//------------------------------------------------------------------------------------//

export async function fetchRevenueChartData(year: number) {
  noStore();
  try {
    const data = await sql<{ month: number; total: number }[]>`
      SELECT 
        EXTRACT(MONTH FROM created_at) as month,
        SUM(total_amount) as total
      FROM transactions
      WHERE EXTRACT(YEAR FROM created_at) = ${year}
      GROUP BY month
      ORDER BY month ASC
    `;

    const chartData = Array.from({ length: 12 }, (_, i) => {
      const monthData = data.find((d) => Number(d.month) === i + 1);
      return {
        name: new Date(0, i).toLocaleString('id-ID', { month: 'short' }),
        total: monthData ? Number(monthData.total) : 0,
      };
    });

    return chartData;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchTransactionTrendData(year: number) {
  noStore();
  try {
    const data = await sql<{ month: number; count: number }[]>`
      SELECT 
        EXTRACT(MONTH FROM created_at) as month,
        COUNT(id) as count
      FROM transactions
      WHERE EXTRACT(YEAR FROM created_at) = ${year}
      GROUP BY month
      ORDER BY month ASC
    `;

    const chartData = Array.from({ length: 12 }, (_, i) => {
      const monthData = data.find((d) => Number(d.month) === i + 1);
      return {
        name: new Date(0, i).toLocaleString('id-ID', { month: 'short' }),
        count: monthData ? Number(monthData.count) : 0,
      };
    });

    return chartData;
  } catch { 
    return [];
  }
}

function calculateGrowth(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
}


// app/lib/data.ts

export async function fetchReportSummary(year: number) {
  noStore();
  const prevYear = year - 1;

  try {
    // 1. Current Year Data
    const currentDataPromise = sql`
      SELECT 
        SUM(t.total_amount) as revenue,
        COUNT(t.id) as transactions,
        COUNT(DISTINCT t.customer_id) as customers
      FROM transactions t
      WHERE EXTRACT(YEAR FROM t.created_at) = ${year}
    `;

    // 2. Previous Year Data
    const prevDataPromise = sql`
      SELECT 
        SUM(t.total_amount) as revenue,
        COUNT(t.id) as transactions,
        COUNT(DISTINCT t.customer_id) as customers
      FROM transactions t
      WHERE EXTRACT(YEAR FROM t.created_at) = ${prevYear}
    `;

    // ✅ 3. HPP Calculation for Current Year
    const currentHPPPromise = sql`
      SELECT 
        SUM(ti.quantity * COALESCE(m.hpp, 0)) as total_hpp
      FROM transaction_items ti
      JOIN transactions t ON ti.transaction_id = t.id
      JOIN menus m ON ti.menu_id = m.id
      WHERE EXTRACT(YEAR FROM t.created_at) = ${year}
    `;

    // ✅ 4. HPP Calculation for Previous Year
    const prevHPPPromise = sql`
      SELECT 
        SUM(ti.quantity * COALESCE(m.hpp, 0)) as total_hpp
      FROM transaction_items ti
      JOIN transactions t ON ti.transaction_id = t.id
      JOIN menus m ON ti.menu_id = m.id
      WHERE EXTRACT(YEAR FROM t.created_at) = ${prevYear}
    `;

    const [currResult, prevResult, currHPP, prevHPP] = await Promise.all([
      currentDataPromise,
      prevDataPromise,
      currentHPPPromise,
      prevHPPPromise,
    ]);

    const current = {
      revenue: Number(currResult[0].revenue) || 0,
      transactions: Number(currResult[0].transactions) || 0,
      customers: Number(currResult[0].customers) || 0,
      hpp: Number(currHPP[0].total_hpp) || 0,
    };

    const previous = {
      revenue: Number(prevResult[0].revenue) || 0,
      transactions: Number(prevResult[0].transactions) || 0,
      customers: Number(prevResult[0].customers) || 0,
      hpp: Number(prevHPP[0].total_hpp) || 0,
    };

    // ✅ Calculate Net Profit
    const currentProfit = current.revenue - current.hpp;
    const previousProfit = previous.revenue - previous.hpp;
    
    // ✅ Calculate Profit Margin
    const profitMargin = current.revenue > 0 
      ? (currentProfit / current.revenue) * 100 
      : 0;

    return {
      totalRevenue: current.revenue,
      revenueGrowth: calculateGrowth(current.revenue, previous.revenue),
      
      totalTransactions: current.transactions,
      transactionGrowth: calculateGrowth(current.transactions, previous.transactions),
      
      totalCustomers: current.customers,
      customerGrowth: calculateGrowth(current.customers, previous.customers),
      
      avgTransaction: current.transactions > 0 
        ? current.revenue / current.transactions 
        : 0,
      avgGrowth: calculateGrowth(
        current.transactions > 0 ? current.revenue / current.transactions : 0,
        previous.transactions > 0 ? previous.revenue / previous.transactions : 0
      ),

      // ✅ NEW: Profit Data
      netProfit: currentProfit,
      profitGrowth: calculateGrowth(currentProfit, previousProfit),
      profitMargin: profitMargin,
    };

  } catch (error) {
    console.error('Error fetching summary:', error);
    return { 
      totalRevenue: 0, revenueGrowth: 0,
      totalTransactions: 0, transactionGrowth: 0,
      totalCustomers: 0, customerGrowth: 0,
      avgTransaction: 0, avgGrowth: 0,
      netProfit: 0, profitGrowth: 0, profitMargin: 0,  // ✅ NEW
    };
  }
}



export async function fetchTopMenuData() {
  noStore();
  try {
    const data = await sql<{ name: string; sold_count: number }[]>`
      SELECT name, sold_count
      FROM menus
      WHERE is_deleted = FALSE
      ORDER BY sold_count DESC
      LIMIT 5
    `;

    return data;
  } catch (error) {
    console.error('Error fetching top menu:', error);
    return [];
  }
}
// Tambahkan di data.ts setelah fetchTopMenuData()

export async function fetchTopCustomers(period: 'all-time' | 'this-month' | 'this-week' = 'all-time') {
  noStore();
  try {
    let dateFilter = sql``;
    
    switch (period) {
      case 'this-week':
        dateFilter = sql`WHERE t.created_at >= date_trunc('week', CURRENT_DATE)`;
        break;
      case 'this-month':
        dateFilter = sql`WHERE t.created_at >= date_trunc('month', CURRENT_DATE)`;
        break;
      case 'all-time':
      default:
        dateFilter = sql``;
        break;
    }

    const data = await sql<{
      name: string;
      transaction_frequency: number;
      total_spent: number;
    }[]>`
      SELECT 
        c.name,
        COUNT(t.id) as transaction_frequency,
        COALESCE(SUM(t.total_amount), 0) as total_spent
      FROM customers c
      LEFT JOIN transactions t ON c.id = t.customer_id
      ${dateFilter}
      GROUP BY c.id, c.name
      HAVING COUNT(t.id) > 0
      ORDER BY total_spent DESC
      LIMIT 5
    `;

    return data.map(customer => ({
      name: customer.name,
      frequency: Number(customer.transaction_frequency),
      totalSpent: Number(customer.total_spent),
      averagePerVisit: Number(customer.total_spent) / Number(customer.transaction_frequency),
    }));
  } catch (error) {
    console.error('Error fetching top customers:', error);
    return [];
  }
}


//------------------------------------------------------------------------------------//
//---------------------------------- Dashboard Data Fetching -------------------------//
//------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------//
//---------------------------------- Dashboard Data Fetching -------------------------//
//------------------------------------------------------------------------------------//

export async function fetchDashboardData() {
  noStore();
  try {
    // ==========================
    // 1. Summary Data Mingguan
    // ==========================
    const summaryQuery = await sql`
      SELECT 
        total_amount, 
        customer_id,
        CASE 
          WHEN created_at >= date_trunc('week', CURRENT_DATE) THEN 'this_week'
          WHEN created_at >= date_trunc('week', CURRENT_DATE) - INTERVAL '1 week' 
               AND created_at < date_trunc('week', CURRENT_DATE) THEN 'last_week'
          ELSE 'older'
        END as period
      FROM transactions
      WHERE created_at >= date_trunc('week', CURRENT_DATE) - INTERVAL '1 week'
    `;

    const customersCount = await sql`SELECT COUNT(id) FROM customers`;

    const thisWeek = { revenue: 0, transactions: 0 };
    const lastWeek = { revenue: 0, transactions: 0 };
    
    const thisWeekCustomers = new Set<string>();
    const lastWeekCustomers = new Set<string>();

    summaryQuery.forEach(row => {
        const amount = Number(row.total_amount);
        const custId = row.customer_id;

        if (row.period === 'this_week') {
            thisWeek.revenue += amount;
            thisWeek.transactions += 1;
            if (custId) thisWeekCustomers.add(custId);
        } else if (row.period === 'last_week') {
            lastWeek.revenue += amount;
            lastWeek.transactions += 1;
            if (custId) lastWeekCustomers.add(custId);
        }
    });

    const revenueGrowth = calculateGrowth(thisWeek.revenue, lastWeek.revenue);
    const txGrowth = calculateGrowth(thisWeek.transactions, lastWeek.transactions);
    const customerGrowth = calculateGrowth(thisWeekCustomers.size, lastWeekCustomers.size);

    const avgThisWeek = thisWeek.transactions > 0 ? thisWeek.revenue / thisWeek.transactions : 0;
    const avgLastWeek = lastWeek.transactions > 0 ? lastWeek.revenue / lastWeek.transactions : 0;
    const avgGrowth = calculateGrowth(avgThisWeek, avgLastWeek);

    // ==============================
// 2. Weekly Chart (Sen–Min)
// ==============================
const chartDataRaw = await sql`
  SELECT 
    TO_CHAR(created_at, 'Dy') as day_name,
    SUM(total_amount) as daily_revenue,
    COUNT(id) as daily_tx
  FROM transactions
  WHERE created_at >= date_trunc('week', CURRENT_DATE)
  GROUP BY day_name
`;

const dayMap: { [key: string]: string } = {
  'Sun': 'Min', 'Mon': 'Sen', 'Tue': 'Sel',
  'Wed': 'Rab', 'Thu': 'Kam', 'Fri': 'Jum', 'Sat': 'Sab'
};

const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const chartMap: any = {};
chartDataRaw.forEach(d => {
  const day = d.day_name.trim();
  chartMap[day] = {
    revenue: Number(d.daily_revenue),
    transactions: Number(d.daily_tx),
  };
});

const charts = daysOrder.map(day => ({
  name: dayMap[day],
  revenue: chartMap[day]?.revenue || 0,
  transactions: chartMap[day]?.transactions || 0,
}));



    // ==============================
    // 3. TOP MENU (Top 5)
    // ==============================
    const topMenuRaw = await sql`
      SELECT name, sold_count
      FROM menus
      WHERE is_deleted = FALSE
      ORDER BY sold_count DESC
      LIMIT 5
    `;

    const topMenu = topMenuRaw.map(m => ({
      name: m.name,
      sold_count: Number(m.sold_count)
    }));



const topCustomersRaw = await sql`
      SELECT 
        name,
        transaction_frequency,
        total_spent
      FROM customers
      WHERE transaction_frequency > 0
      ORDER BY total_spent DESC
      LIMIT 5
    `;

    const topCustomers = topCustomersRaw.map(customer => ({
      name: customer.name,
      frequency: Number(customer.transaction_frequency),
      totalSpent: Number(customer.total_spent),
      averagePerVisit: Number(customer.total_spent) / Number(customer.transaction_frequency),
    }));

    // ==============================
    // FINAL RETURN
    // ==============================
    return {
      cards: {
        revenue: thisWeek.revenue,
        revenueGrowth,
        transactions: thisWeek.transactions,
        txGrowth,
        customers: Number(customersCount[0].count), 
        customerGrowth, 
        avgTx: avgThisWeek,
        avgGrowth,
      },
      charts,
      topMenu,
      topCustomers,   // <= Tambahkan ini
    };

  } catch (error) {
    console.error('Dashboard Error:', error);
    return {
      cards: { revenue: 0, revenueGrowth: 0, transactions: 0, txGrowth: 0, customers: 0, customerGrowth: 0, avgTx: 0, avgGrowth: 0 },
      charts: [],
      topMenu: [],
      topCustomers: []  // <= Tambahkan ini
    };
  }
}

 
// Tambahkan ke data.ts

export async function fetchCustomerById(id: string): Promise<Customer> {
  // Validasi input
  if (!id || typeof id !== 'string') {
    throw new Error('ID pelanggan tidak valid');
  }

  const result = await sql`
    SELECT 
      id,
      name,
      phone,
      address,
      transaction_frequency,
      total_spent
    FROM customers
    WHERE id = ${id}
    LIMIT 1
  `;

  if (result.length === 0) {
    throw new Error('Pelanggan tidak ditemukan');
  }

  return {
    id: result[0].id,
    name: result[0].name,
    phone: result[0].phone,
    address: result[0].address,
    transaction_frequency: result[0].transaction_frequency,
    total_spent: result[0].total_spent,
  };
}