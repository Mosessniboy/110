'use client';

import { Customer, Menu, Transaction } from '@/app/lib/definitions';
import { updateTransaction, TransactionState } from '@/app/lib/actions';
import { useActionState, useState, useEffect, useMemo } from 'react';
import { formatCurrency } from '@/app/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function EditTransactionForm({
  transaction,
  customers,
  menus,
}: {
  transaction: Transaction;
  customers: Customer[];
  menus: Menu[];
}) {
  const initialState: TransactionState = { message: null, errors: {} };
  const updateTxWithId = updateTransaction.bind(null, transaction.id);
  const [state, formAction] = useActionState(updateTxWithId, initialState);

  const [cart, setCart] = useState<CartItem[]>([]);

  const [selectedCustomer, setSelectedCustomer] = useState(() => {
    const customer = customers.find(
      (c) => c.name === transaction.customer_name
    );
    return customer?.id || '';
  });

  useEffect(() => {
    if (!transaction.items) return;

    const updatedCart = transaction.items.map((item) => {
      const menu = menus.find((m) => m.name === item.menu_name);
      return {
        id: menu?.id ?? item.menu_name,
        name: item.menu_name,
        price: item.price,
        quantity: item.quantity,
      };
    });

    setCart(updatedCart);
  }, [transaction.items, menus]);

  const subTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const grandTotal = subTotal;

  const addToCart = (menu: Menu) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        { id: menu.id, name: menu.name, price: menu.price, quantity: 1 },
      ];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.message && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {state.message}
        </div>
      )}

      {/* Customer */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          Pilih Pelanggan (Opsional)
        </label>
        <select
          name="customerId"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2"
        >
          <option value="">-- Tanpa Pelanggan --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Menu */}
      <div>
        <label className="mb-2 block text-sm font-medium">Pilih Menu</label>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {menus
            .filter((m) => !m.is_deleted)
            .map((menu) => (
              <button
                key={menu.id}
                type="button"
                onClick={() => addToCart(menu)}
                className="rounded-lg border-2 border-pink-200 p-3 text-left hover:border-pink-400 hover:bg-pink-50 transition"
              >
                <div className="font-semibold text-gray-800">{menu.name}</div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(menu.price)}
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Cart */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">Keranjang</h3>
        {cart.length === 0 ? (
          <p className="text-gray-500">Belum ada item</p>
        ) : (
          <div className="space-y-2">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    {formatCurrency(item.price)} × {item.quantity} ={' '}
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="rounded-md border p-1"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="w-8 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="rounded-md border p-1"
                  >
                    <Plus className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="ml-2 rounded-md border border-red-300 p-1 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="rounded-lg bg-pink-100 p-4 space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subTotal)}</span>
        </div>

        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-pink-600">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Hidden */}
      <input type="hidden" name="items" value={JSON.stringify(cart)} />
      <input type="hidden" name="totalAmount" value={grandTotal} />

      {/* Action */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={cart.length === 0}
          className="flex-1 rounded-lg bg-pink-500 py-2 font-semibold text-white disabled:bg-gray-300"
        >
          Update Transaksi
        </button>

        <Link
          href="/dashboard/transaksi"
          className="rounded-lg border px-4 py-2 font-semibold"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
