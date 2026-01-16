'use server';

import { z } from 'zod';
// import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { fetchTransactionById } from './data';
import sql from './db';
// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
import { auth } from '@/app/lib/auth'
import { HandGrab } from 'lucide-react';


const FormSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nama tidak boleh kosong.' }),
  phone: z.string().trim().min(1, { message: 'Nomor HP wajib diisi.' }),
  address: z.string().trim().min(1, { message: 'Alamat wajib diisi.' }),
  transaction_frequency: z.coerce.number(),
  total_spent: z.coerce.number(),
});

const CreateCustomer = FormSchema;

export type State = {
  errors?: {
    name?: string[];
    phone?: string[];
    address?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    phone?: string;
    address?: string;
  };
};

export async function createCustomer(prevState: State, formData: FormData) {
  const rawFormData = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
  };

  const validatedFields = CreateCustomer.safeParse({
    ...rawFormData,
    transaction_frequency: 0,
    total_spent: 0,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Gagal membuat pelanggan. Periksa input Anda.',
      values: rawFormData,
    };
  }

  const { name, phone, address } = validatedFields.data;

  try {
    // Cek Duplikat
    const existingUser = await sql`
      SELECT id FROM customers WHERE phone = ${phone} LIMIT 1
    `;

    if (existingUser.length > 0) {
      return {
        errors: {
          phone: ['Nomor HP ini sudah terdaftar. Gunakan nomor lain.'],
        },
        message: 'Gagal. Nomor HP duplikat.',
        values: rawFormData,
      };
    }

    await sql`
      INSERT INTO customers (name, phone, address, transaction_frequency, total_spent)
      VALUES (${name}, ${phone}, ${address}, 0, 0)
    `;
  } catch (error) {
    console.error('Database Error:', error); // Log error
    return {
      message: 'Database Error: Gagal membuat pelanggan.',
      values: rawFormData,
    };
  }

  revalidatePath('/dashboard/pelanggan');
  redirect('/dashboard/pelanggan');
}
// Tambahkan ke actions.ts (setelah createCustomer)

// Tambahkan ke actions.ts (setelah createCustomer)
// PASTIKAN import redirect sudah ada di atas: import { redirect } from 'next/navigation';

const UpdateCustomerSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nama tidak boleh kosong.' }),
  phone: z.string().trim().min(1, { message: 'Nomor HP wajib diisi.' }),
  address: z.string().trim().min(1, { message: 'Alamat wajib diisi.' }),
});

export type UpdateCustomerState = {
  errors?: {
    name?: string[];
    phone?: string[];
    address?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    phone?: string;
    address?: string;
  };
};

export async function updateCustomer(
  id: string,
  prevState: UpdateCustomerState,
  formData: FormData
) {
  const rawFormData = {
    name: formData.get('name') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
  };

  const validatedFields = UpdateCustomerSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Gagal mengupdate pelanggan. Periksa input Anda.',
      values: rawFormData,
    };
  }

  const { name, phone, address } = validatedFields.data;

  try {
    // Cek duplikat nomor HP (kecuali nomor customer sendiri)
    const existingUser = await sql`
      SELECT id FROM customers 
      WHERE phone = ${phone} AND id != ${id}
      LIMIT 1
    `;

    if (existingUser.length > 0) {
      return {
        errors: {
          phone: ['Nomor HP ini sudah digunakan pelanggan lain.'],
        },
        message: 'Gagal. Nomor HP duplikat.',
        values: rawFormData,
      };
    }

    // Update customer
    await sql`
      UPDATE customers
      SET name = ${name}, phone = ${phone}, address = ${address}
      WHERE id = ${id}
    `;

  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Gagal mengupdate pelanggan.',
      values: rawFormData,
    };
  }

  revalidatePath('/dashboard/pelanggan');
  redirect('/dashboard/pelanggan');
}
// Tambahkan ke actions.ts

export async function deleteCustomer(id: string) {
  try {
    // Cek apakah customer memiliki transaksi
    const transactions = await sql`
      SELECT COUNT(*) as count 
      FROM transactions 
      WHERE customer_id = ${id}
    `;

    const transactionCount = parseInt(transactions[0].count);

    if (transactionCount > 0) {
      throw new Error(
        `Pelanggan ini memiliki ${transactionCount} transaksi. Tidak dapat dihapus.`
      );
    }

    // Hapus customer jika tidak ada transaksi
    await sql`DELETE FROM customers WHERE id = ${id}`;

  } catch (error) {
    console.error('Delete Customer Failed:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Gagal menghapus pelanggan'
    );
  }

  revalidatePath('/dashboard/pelanggan');
}
//------------
//stok
//------------

// Bagian Stock dari actions.ts - COPY PASTE ini menggantikan bagian stock yang lama

const StockSchema = z.object({
  name: z.string().min(1, { message: 'Nama tidak boleh kosong.' }),
  unit: z.enum(['gram', 'ml', 'pcs', 'lembar'], { message: 'Satuan tidak valid.' }),
  stock: z.coerce.number().min(0, { message: 'Stok tidak boleh negatif.' }),
  min_stock: z.coerce.number().min(0, { message: 'Stok minimum tidak boleh negatif.' }),
  cost_per_unit: z.coerce.number().min(0, { message: 'Harga per unit tidak boleh negatif.' }),
});

export type StockState = {
  errors?: {
    name?: string[];
    unit?: string[];
    stock?: string[];
    min_stock?: string[];
    cost_per_unit?: string[];
  };
  message?: string | null;
  values?: {
    name?: string;
    unit?: string;
    stock?: number;
    min_stock?: number;
    cost_per_unit?: number;
  };
};

export async function createStock(prevState: StockState, formData: FormData): Promise<StockState> {
  const rawData = {
    name: formData.get('name'),
    unit: formData.get('unit'),
    stock: formData.get('stock'),
    min_stock: formData.get('min_stock'),
    cost_per_unit: formData.get('cost_per_unit'),
  };

  const validated = StockSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Gagal menyimpan. Periksa input Anda.',
      values: {
        name: rawData.name as string,
        unit: rawData.unit as string,
        stock: rawData.stock ? Number(rawData.stock) : undefined,
        min_stock: rawData.min_stock ? Number(rawData.min_stock) : undefined,
        cost_per_unit: rawData.cost_per_unit ? Number(rawData.cost_per_unit) : undefined,
      },
    };
  }

  const { name, unit, stock, min_stock, cost_per_unit } = validated.data;

  try {
    await sql`
      INSERT INTO stocks (name, unit, stock, min_stock, cost_per_unit)
      VALUES (${name}, ${unit}, ${stock}, ${min_stock}, ${cost_per_unit})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Gagal membuat stok.',
      values: {
        name: rawData.name as string,
        unit: rawData.unit as string,
        stock: rawData.stock ? Number(rawData.stock) : undefined,
        min_stock: rawData.min_stock ? Number(rawData.min_stock) : undefined,
        cost_per_unit: rawData.cost_per_unit ? Number(rawData.cost_per_unit) : undefined,
      },
    };
  }

  revalidatePath('/dashboard/stok');
  redirect('/dashboard/stok');
}

export async function updateStock(id: string, prevState: StockState, formData: FormData): Promise<StockState> {
  const rawData = {
    name: formData.get('name'),
    unit: formData.get('unit'),
    stock: formData.get('stock'),
    min_stock: formData.get('min_stock'),
    cost_per_unit: formData.get('cost_per_unit'),
  };

  const validated = StockSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Gagal mengupdate. Periksa input Anda.',
      values: {
        name: rawData.name as string,
        unit: rawData.unit as string,
        stock: rawData.stock ? Number(rawData.stock) : undefined,
        min_stock: rawData.min_stock ? Number(rawData.min_stock) : undefined,
        cost_per_unit: rawData.cost_per_unit ? Number(rawData.cost_per_unit) : undefined,
      },
    };
  }

  const { name, unit, stock, min_stock, cost_per_unit } = validated.data;

  try {
    await sql`
      UPDATE stocks
      SET
        name = ${name},
        unit = ${unit},
        stock = ${stock},
        min_stock = ${min_stock},
        cost_per_unit = ${cost_per_unit}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Gagal mengupdate stok.',
      values: {
        name: rawData.name as string,
        unit: rawData.unit as string,
        stock: rawData.stock ? Number(rawData.stock) : undefined,
        min_stock: rawData.min_stock ? Number(rawData.min_stock) : undefined,
        cost_per_unit: rawData.cost_per_unit ? Number(rawData.cost_per_unit) : undefined,
      },
    };
  }

  revalidatePath('/dashboard/stok');
  redirect('/dashboard/stok');
}

export async function deleteStock(id: string) {
  try {
    await sql`
      DELETE FROM stocks WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal menghapus stok.');
  }

  revalidatePath('/dashboard/stok');
}

//--------------------------------------------
// Menu Actions
//--------------------------------------------

// Replace Menu Actions di actions.ts dengan ini:

// Replace Menu Actions di actions.ts dengan ini:

const MenuSchema = z.object({
  name: z.string().min(1, { message: 'Nama menu wajib diisi' }),
  description: z.string().min(1),
  price: z.coerce.number().min(0),
  recipes: z.string().transform((str) => {
    try {
      return JSON.parse(str) as { stock_id: string; amount: number }[];
    } catch {
      return [];
    }
  }),
});

// ✅ FUNGSI HELPER: Hitung HPP dari resep
async function calculateHPP(recipes: { stock_id: string; amount: number }[]) {
  let totalHPP = 0;

  for (const recipe of recipes) {
    const stock = await sql`
      SELECT cost_per_unit FROM stocks WHERE id = ${recipe.stock_id} LIMIT 1
    `;
    
    if (stock.length > 0) {
      const costPerUnit = Number(stock[0].cost_per_unit);
      const cost = costPerUnit * recipe.amount;
      totalHPP += cost;
      
      // ✅ DEBUG LOG
      console.log(`Recipe: ${recipe.stock_id}, Cost/Unit: ${costPerUnit}, Amount: ${recipe.amount}, Total: ${cost}`);
    }
  }

  // ✅ Round to 2 decimal untuk presisi
  const rounded = Math.round(totalHPP * 100) / 100;
  console.log(`Total HPP: ${totalHPP} -> Rounded: ${rounded}`);
  
  return rounded;
}

export async function createMenu(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    recipes: formData.get('recipes'),
  };

  const validated = MenuSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      message: 'Validasi Gagal',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, recipes } = validated.data;

  try {
    // ✅ 1. Hitung HPP
    const hpp = await calculateHPP(recipes);

    // ✅ 2. Insert Menu dengan HPP
    const menuResult = await sql`
      INSERT INTO menus (name, description, price, hpp, sold_count, is_deleted,)
      VALUES (${name}, ${description}, ${price}, ${hpp}, 0, FALSE)
      RETURNING id
    `;
    const newMenuId = menuResult[0].id;

    // 3. Insert Resep
    if (recipes.length > 0) {
      for (const recipe of recipes) {
        await sql`
          INSERT INTO menu_recipes (menu_id, stock_id, amount_needed)
          VALUES (${newMenuId}, ${recipe.stock_id}, ${recipe.amount})
        `;
      }
    }

  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Gagal membuat menu.' };
  }

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');
}

export async function updateMenu(id: string, prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    recipes: formData.get('recipes'),
  };

  const validated = MenuSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      message: 'Validasi Gagal',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const { name, description, price, recipes } = validated.data;

  try {
    // ✅ 1. Hitung HPP baru
    const hpp = await calculateHPP(recipes);

    // ✅ 2. Update Menu dengan HPP
    await sql`
      UPDATE menus 
      SET name = ${name}, description = ${description}, price = ${price}, hpp = ${hpp}
      WHERE id = ${id}
    `;

    // 3. DELETE & INSERT ulang resep
    await sql`DELETE FROM menu_recipes WHERE menu_id = ${id}`;

    if (recipes.length > 0) {
      for (const recipe of recipes) {
        await sql`
          INSERT INTO menu_recipes (menu_id, stock_id, amount_needed)
          VALUES (${id}, ${recipe.stock_id}, ${recipe.amount})
        `;
      }
    }

  } catch (error) {
    console.error(error);
    return { message: 'Database Error: Gagal update menu.' };
  }

  revalidatePath('/dashboard/menu');
  redirect('/dashboard/menu');
}



export async function deleteMenu(id: string) {
  await sql`UPDATE menus SET is_deleted = TRUE WHERE id = ${id}`;
  revalidatePath('/dashboard/menu');
}

//--------------------------------------------
// Transaction Actions
//--------------------------------------------

export async function getTransactionDetail(id: string) {
  return await fetchTransactionById(id);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createTransaction(prevState: any, formData: FormData) {
  const rawData = {
    customerId: formData.get('customerId') as string,
    items: formData.get('items') as string,
    totalAmount: Number(formData.get('totalAmount')),
    ongkir: Number(formData.get('ongkir') || 0), // TAMBAHKAN INI
    discountPercentage: Number(formData.get('discountPercentage') || 0),
    discountAmount: Number(formData.get('discountAmount') || 0),
  };

  let cartItems: { id: string; price: number; quantity: number }[] = [];
  try {
    cartItems = JSON.parse(rawData.items);
  } catch (e) {
    console.error(e);
    return { message: 'Data keranjang tidak valid.' };
  }

  if (cartItems.length === 0) {
    return { message: 'Keranjang belanja kosong.' };
  }

  const trxId = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    await sql.begin(async (sql) => {
      
      for (const item of cartItems) {
        
        await sql`
          UPDATE menus 
          SET sold_count = sold_count + ${item.quantity}
          WHERE id = ${item.id}
        `;

        const recipes = await sql`
          SELECT stock_id, amount_needed 
          FROM menu_recipes 
          WHERE menu_id = ${item.id}
        `;

        for (const recipe of recipes) {
          const totalNeeded = recipe.amount_needed * item.quantity;

          const updatedStock = await sql`
            UPDATE stocks 
            SET stock = stock - ${totalNeeded}
            WHERE id = ${recipe.stock_id}
            RETURNING stock, name
          `;

          if (updatedStock[0].stock < 0) {
            throw new Error(`Stok bahan '${updatedStock[0].name}' tidak mencukupi.`);
          }
        }
      }

      const custId = rawData.customerId && rawData.customerId !== "" ? rawData.customerId : null;

      // INSERT dengan data ongkir dan diskon
      await sql`
        INSERT INTO transactions (
          id, 
          customer_id, 
          total_amount,
          ongkir,
          discount_percentage,
          discount_amount,
          created_at
        )
        VALUES (
          ${trxId}, 
          ${custId}, 
          ${rawData.totalAmount},
          ${rawData.ongkir},
          ${rawData.discountPercentage},
          ${rawData.discountAmount},
          CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta'
        )
      `;

      if (custId) {
        await sql`
          UPDATE customers
          SET 
            transaction_frequency = transaction_frequency + 1,
            total_spent = total_spent + ${rawData.totalAmount}
          WHERE id = ${custId}
        `;
      }

      for (const item of cartItems) {
        await sql`
          INSERT INTO transaction_items (transaction_id, menu_id, quantity, price_at_time, subtotal)
          VALUES (${trxId}, ${item.id}, ${item.quantity}, ${item.price}, ${item.price * item.quantity})
        `;
      }
    });

  } catch (error) {
    console.error('Transaction Failed:', error);
    return { message: 'Gagal memproses transaksi: ' + (error instanceof Error ? error.message : '') };
  }

  revalidatePath('/dashboard/transaksi');
  revalidatePath('/dashboard/stok'); 
  revalidatePath('/dashboard/menu'); 
  revalidatePath('/dashboard/pelanggan'); 
  
  redirect('/dashboard/transaksi');
}


// Tambahkan ke actions.ts Anda

const TransactionSchema = z.object({
  customerId: z.string().nullable(),
  items: z.string().transform((str) => {
    try {
      return JSON.parse(str) as { id: string; price: number; quantity: number }[];
    } catch {
      return [];
    }
  }),
  totalAmount: z.coerce.number().min(0),
});

export type TransactionState = {
  errors?: {
    customerId?: string[];
    items?: string[];
    totalAmount?: string[];
  };
  message?: string | null;
};

export async function updateTransaction(
  id: string,
  prevState: TransactionState,
  formData: FormData
) {
  const session = await auth();
  const userRole = session?.user?.role || 'staff';
  
  if (userRole !== 'admin') {
    return {
      message: '⛔ Akses ditolak. Hanya admin yang dapat mengedit transaksi.',
    };
  }

  const rawData = {
    customerId: formData.get('customerId') as string || null,
    items: formData.get('items') as string,
    totalAmount: formData.get('totalAmount'),
    ongkir: Number(formData.get('ongkir') || 0), // TAMBAHKAN INI
    discountPercentage: Number(formData.get('discountPercentage') || 0),
    discountAmount: Number(formData.get('discountAmount') || 0),
  };

  const validated = TransactionSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Validasi gagal. Periksa input Anda.',
    };
  }

  const { customerId, items, totalAmount } = validated.data;

  if (items.length === 0) {
    return { message: 'Keranjang belanja kosong.' };
  }

  try {
    await sql.begin(async (sql) => {
      // 1. Ambil data transaksi lama
      const oldTransaction = await sql`
        SELECT ti.menu_id, ti.quantity, t.customer_id, t.total_amount
        FROM transaction_items ti
        JOIN transactions t ON t.id = ti.transaction_id
        WHERE ti.transaction_id = ${id}
      `;

      const oldCustomerId = oldTransaction[0]?.customer_id;
      const oldTotalAmount = oldTransaction[0]?.total_amount || 0;

      // 2. Rollback sold_count dan stok
      for (const oldItem of oldTransaction) {
        await sql`
          UPDATE menus 
          SET sold_count = sold_count - ${oldItem.quantity}
          WHERE id = ${oldItem.menu_id}
        `;

        const recipes = await sql`
          SELECT stock_id, amount_needed 
          FROM menu_recipes 
          WHERE menu_id = ${oldItem.menu_id}
        `;

        for (const recipe of recipes) {
          const totalNeeded = recipe.amount_needed * oldItem.quantity;
          await sql`
            UPDATE stocks 
            SET stock = stock + ${totalNeeded}
            WHERE id = ${recipe.stock_id}
          `;
        }
      }

      // 3. Rollback customer stats
      if (oldCustomerId) {
        await sql`
          UPDATE customers
          SET 
            transaction_frequency = transaction_frequency - 1,
            total_spent = total_spent - ${oldTotalAmount}
          WHERE id = ${oldCustomerId}
        `;
      }

      // 4. Proses transaksi baru
      for (const item of items) {
        await sql`
          UPDATE menus 
          SET sold_count = sold_count + ${item.quantity}
          WHERE id = ${item.id}
        `;

        const recipes = await sql`
          SELECT stock_id, amount_needed 
          FROM menu_recipes 
          WHERE menu_id = ${item.id}
        `;

        for (const recipe of recipes) {
          const totalNeeded = recipe.amount_needed * item.quantity;

          const updatedStock = await sql`
            UPDATE stocks 
            SET stock = stock - ${totalNeeded}
            WHERE id = ${recipe.stock_id}
            RETURNING stock, name
          `;

          if (updatedStock[0].stock < 0) {
            throw new Error(`Stok bahan '${updatedStock[0].name}' tidak mencukupi.`);
          }
        }
      }

      // 5. Update transaksi utama DENGAN DATA ONGKIR DAN DISKON
      const newCustomerId = customerId && customerId !== "" ? customerId : null;
      
      await sql`
        UPDATE transactions
        SET 
          customer_id = ${newCustomerId}, 
          total_amount = ${totalAmount},
          ongkir = ${rawData.ongkir},
          discount_percentage = ${rawData.discountPercentage},
          discount_amount = ${rawData.discountAmount}
        WHERE id = ${id}
      `;

      // 6. Update customer stats baru
      if (newCustomerId) {
        await sql`
          UPDATE customers
          SET 
            transaction_frequency = transaction_frequency + 1,
            total_spent = total_spent + ${totalAmount}
          WHERE id = ${newCustomerId}
        `;
      }

      // 7. Update transaction_items
      await sql`DELETE FROM transaction_items WHERE transaction_id = ${id}`;

      for (const item of items) {
        await sql`
          INSERT INTO transaction_items (transaction_id, menu_id, quantity, price_at_time, subtotal)
          VALUES (${id}, ${item.id}, ${item.quantity}, ${item.price}, ${item.price * item.quantity})
        `;
      }
    });

  } catch (error) {
    console.error('Update Transaction Failed:', error);
    return { 
      message: error instanceof Error ? error.message : 'Gagal mengupdate transaksi.' 
    };
  }

  revalidatePath('/dashboard/transaksi');
  revalidatePath('/dashboard/stok');
  revalidatePath('/dashboard/menu');
  revalidatePath('/dashboard/pelanggan');

  redirect('/dashboard/transaksi');
}

// Tambahkan ke actions.ts

export async function deleteTransaction(id: string) {
 const session = await auth();
  const userRole = session?.user?.role || 'staff';
  
  if (userRole !== 'admin') {
    throw new Error('⛔ Akses ditolak. Hanya admin yang dapat menghapus transaksi.');
  }
  try {
    await sql.begin(async (sql) => {
      // 1. Ambil data transaksi yang akan dihapus
      const transaction = await sql`
        SELECT ti.menu_id, ti.quantity, t.customer_id, t.total_amount
        FROM transaction_items ti
        JOIN transactions t ON t.id = ti.transaction_id
        WHERE ti.transaction_id = ${id}
      `;

      if (transaction.length === 0) {
        throw new Error('Transaksi tidak ditemukan');
      }

      const customerId = transaction[0].customer_id;
      const totalAmount = transaction[0].total_amount;

      // 2. Rollback sold_count menu
      for (const item of transaction) {
        await sql`
          UPDATE menus 
          SET sold_count = sold_count - ${item.quantity}
          WHERE id = ${item.menu_id}
        `;

        // 3. Rollback stok bahan
        const recipes = await sql`
          SELECT stock_id, amount_needed 
          FROM menu_recipes 
          WHERE menu_id = ${item.menu_id}
        `;

        for (const recipe of recipes) {
          const totalNeeded = recipe.amount_needed * item.quantity;
          await sql`
            UPDATE stocks 
            SET stock = stock + ${totalNeeded}
            WHERE id = ${recipe.stock_id}
          `;
        }
      }

      // 4. Rollback customer stats (jika ada)
      if (customerId) {
        await sql`
          UPDATE customers
          SET 
            transaction_frequency = GREATEST(0, transaction_frequency - 1),
            total_spent = GREATEST(0, total_spent - ${totalAmount})
          WHERE id = ${customerId}
        `;
      }

      // 5. Hapus transaction_items
      await sql`DELETE FROM transaction_items WHERE transaction_id = ${id}`;

      // 6. Hapus transaction
      await sql`DELETE FROM transactions WHERE id = ${id}`;
    });

  } catch (error) {
    console.error('Delete Transaction Failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Gagal menghapus transaksi');
  }

  revalidatePath('/dashboard/transaksi');
  revalidatePath('/dashboard/stok');
  revalidatePath('/dashboard/menu');
  revalidatePath('/dashboard/pelanggan');
}




//--------------------------------------------
// Expense Actions
//--------------------------------------------

const ExpenseSchema = z.object({
  category: z.string().min(1, { message: 'Kategori wajib diisi' }),
  amount: z.coerce.number().min(0, { message: 'Jumlah tidak boleh negatif' }),
  description: z.string().optional(),
  payment_method: z.string().optional(),
  expense_date: z.string().min(1, { message: 'Tanggal wajib diisi' }),
});

export type ExpenseState = {
  errors?: {
    category?: string[];
    amount?: string[];
    expense_date?: string[];
  };
  message?: string | null;
  values?: {
    category?: string;
    amount?: number;
    description?: string;
    payment_method?: string;
    expense_date?: string;
  };
};

export async function createExpense(
  prevState: ExpenseState,
  formData: FormData
): Promise<ExpenseState> {
  const rawData = {
    category: formData.get('category'),
    amount: formData.get('amount'),
    description: formData.get('description') || '',
    payment_method: formData.get('payment_method') || '',
    expense_date: formData.get('expense_date'), // format: YYYY-MM-DD
  };

  const validated = ExpenseSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Gagal menyimpan. Periksa input Anda.',
      values: {
        category: rawData.category as string,
        amount: rawData.amount ? Number(rawData.amount) : undefined,
        description: rawData.description as string,
        payment_method: rawData.payment_method as string,
        expense_date: rawData.expense_date as string,
      },
    };
  }

  const { category, amount, expense_date } = validated.data;

  const description = validated.data.description || '';
  const payment_method = validated.data.payment_method || '';

  const expenseId = `EXP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    await sql`
      INSERT INTO expenses (
        id,
        category,
        amount,
        description,
        payment_method,
        expense_date,
        created_at
      )
      VALUES (
        ${expenseId},
        ${category},
        ${amount},
        ${description},
        ${payment_method},
        (${expense_date}::date + time '00:00') AT TIME ZONE 'Asia/Jakarta',
        CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Jakarta'
      )
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Gagal menyimpan pengeluaran.',
      values: validated.data,
    };
  }

  revalidatePath('/dashboard/pengeluaran');
  redirect('/dashboard/pengeluaran');
}

export async function updateExpense(id: string, prevState: ExpenseState, formData: FormData): Promise<ExpenseState> {
  const rawData = {
    category: formData.get('category'),
    amount: formData.get('amount'),
    description: formData.get('description') || '',
    payment_method: formData.get('payment_method') || '',
    expense_date: formData.get('expense_date'),
  };

  const validated = ExpenseSchema.safeParse(rawData);
  
  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Gagal mengupdate. Periksa input Anda.',
      values: {
        category: rawData.category as string,
        amount: rawData.amount ? Number(rawData.amount) : undefined,
        description: rawData.description as string,
        payment_method: rawData.payment_method as string,
        expense_date: rawData.expense_date as string,
      },
    };
  }

  const { category, amount, expense_date } = validated.data;
  
  // ✅ FIX: Berikan default value untuk optional fields
  const description = validated.data.description || '';
  const payment_method = validated.data.payment_method || '';

  try {
    await sql`
      UPDATE expenses
      SET
        category = ${category},
        amount = ${amount},
        description = ${description},
        payment_method = ${payment_method},
        expense_date = ${expense_date}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Gagal mengupdate pengeluaran.',
      values: validated.data,
    };
  }

  revalidatePath('/dashboard/pengeluaran');
  redirect('/dashboard/pengeluaran');
}

export async function deleteExpense(id: string) {
  try {
    await sql`DELETE FROM expenses WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Gagal menghapus pengeluaran.');
  }

  revalidatePath('/dashboard/pengeluaran');
}


