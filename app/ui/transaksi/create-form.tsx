'use client';

import { useState, useMemo } from 'react';
import { useActionState } from 'react';
import { createTransaction } from '@/app/lib/actions';
import { Menu } from '@/app/lib/definitions';
import { formatCurrency, getCustomerStatus } from '@/app/lib/utils';
import {
  ShoppingCart,
  Plus,
  Minus,
  User,
  Search,
  Utensils,
  Percent,
  Truck,
} from 'lucide-react';
import Link from 'next/link';

type CustomerOption = {
  id: string;
  name: string;
  transaction_frequency: number;
};

type CartItem = Menu & { quantity: number };

export default function POSTransaction({
  menus,
  customers,
}: {
  menus: Menu[];
  customers: CustomerOption[];
}) {
  const [state, formAction] = useActionState(createTransaction, null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [useDiscount, setUseDiscount] = useState(false);
  const [editingQty, setEditingQty] = useState<{ [key: string]: string }>({});
  const [ongkir, setOngkir] = useState('0');

  const filteredMenus = menus.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { subTotal, discountAmount, ongkirAmount, grandTotal } = useMemo(() => {
    const sub = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const disc = useDiscount ? sub * 0.05 : 0;
    const ongkirNum = parseInt(ongkir) || 0;
    return {
      subTotal: sub,
      discountAmount: disc,
      ongkirAmount: ongkirNum,
      grandTotal: sub - disc + ongkirNum,
    };
  }, [cart, useDiscount, ongkir]);

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
      return [...prev, { ...menu, quantity: 1 }];
    });
  };

  const decreaseQty = (id: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleQtyChange = (id: string, value: string) => {
    setEditingQty((prev) => ({ ...prev, [id]: value }));
  };

  const handleQtyBlur = (id: string) => {
    const value = editingQty[id];
    const numValue = parseInt(value) || 0;
    
    if (numValue <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: numValue } : item
        )
      );
    }
    
    setEditingQty((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const handleQtyKeyDown = (id: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleOngkirChange = (value: string) => {
    // Hanya izinkan angka
    const numericValue = value.replace(/[^0-9]/g, '');
    setOngkir(numericValue);
  };

  const getStatusIcon = (freq: number) => {
    const status = getCustomerStatus(freq);
    switch (status) {
      case 'hot':
        return '🔥 Hot';
      case 'warm':
        return '😊 Warm';
      case 'cool':
        return '😐 Cool';
      default:
        return '🧊 Cold';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-0 lg:h-[calc(100vh-120px)]">
      {/* ===== MENU / KATALOG ===== */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 min-h-0">
        {/* Search */}
        <div className="p-4 border-b border-gray-100 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-pink-500"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {filteredMenus.map((menu) => (
              <button
                key={menu.id}
                type="button"
                onClick={() => addToCart(menu)}
                className="flex flex-col text-left bg-white p-3 rounded-xl border border-gray-200 hover:border-pink-500 hover:shadow-md transition group"
              >
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 mb-2 group-hover:bg-pink-600 group-hover:text-white transition">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm line-clamp-1">
                  {menu.name}
                </h3>
                <p className="text-pink-600 font-bold text-sm mt-auto">
                  {formatCurrency(menu.price)}
                </p>
              </button>
            ))}
          </div>

          {filteredMenus.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Menu tidak ditemukan
            </div>
          )}
        </div>
      </div>

      {/* ===== CART ===== */}
      <div className="w-full lg:w-[380px] flex flex-col bg-white rounded-xl shadow-lg border border-gray-100 min-h-0">
        <form action={formAction} className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b bg-pink-600 text-white rounded-t-xl">
            <h2 className="font-bold flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Keranjang Pesanan
            </h2>
          </div>

          {/* Customer */}
          <div className="p-4 border-b bg-gray-50">
            <label className="text-xs font-bold text-gray-500 mb-1 block">
              Pilih Pelanggan
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                name="customerId"
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-pink-500 bg-white"
              >
                <option value="">Umum / Guest</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({getStatusIcon(c.transaction_frequency)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm italic">
                Keranjang masih kosong
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b border-dashed pb-3"
                >
                  <div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      {formatCurrency(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => decreaseQty(item.id)}
                        className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="text"
                        value={editingQty[item.id] ?? item.quantity}
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        onBlur={() => handleQtyBlur(item.id)}
                        onKeyDown={(e) => handleQtyKeyDown(item.id, e)}
                        className="w-12 text-center text-sm font-bold bg-white rounded border border-gray-200 focus:outline-pink-500 focus:border-pink-500"
                      />
                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="w-6 h-6 bg-white rounded shadow-sm flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm font-bold">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer - Summary */}
          <div className="p-4 bg-gray-50 border-t space-y-3">
            {/* Ongkir */}
            {cart.length > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-gray-800">
                    Ongkos Kirim
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={ongkir}
                    onChange={(e) => handleOngkirChange(e.target.value)}
                    placeholder="0"
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-blue-200 text-sm focus:outline-blue-500 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Toggle Diskon */}
            {cart.length > 0 && (
              <label className="flex items-center gap-2 p-3 bg-pink-50 border border-pink-200 rounded-lg cursor-pointer hover:bg-pink-100 transition">
                <input
                  type="checkbox"
                  checked={useDiscount}
                  onChange={(e) => setUseDiscount(e.target.checked)}
                  className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                />
                <Percent className="w-4 h-4 text-pink-600" />
                <span className="text-sm font-semibold text-gray-800">
                  Diskon 5%
                </span>
                {useDiscount && (
                  <span className="ml-auto text-xs text-pink-600 font-bold">
                    -{formatCurrency(discountAmount)}
                  </span>
                )}
              </label>
            )}

            {/* Summary */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subTotal)}</span>
              </div>

              {ongkirAmount > 0 && (
                <div className="flex justify-between text-sm text-blue-600 font-semibold">
                  <span>Ongkir</span>
                  <span>+{formatCurrency(ongkirAmount)}</span>
                </div>
              )}

              {useDiscount && (
                <div className="flex justify-between text-sm text-pink-600 font-semibold">
                  <span>Diskon (5%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-bold text-gray-800">Total Bayar</span>
                <span className="text-2xl font-bold text-pink-600">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            {/* Hidden Inputs */}
            <input type="hidden" name="items" value={JSON.stringify(cart)} />
            <input type="hidden" name="totalAmount" value={grandTotal} />
            <input type="hidden" name="ongkir" value={ongkirAmount} />
            <input type="hidden" name="discountPercentage" value={useDiscount ? 5 : 0} />
            <input type="hidden" name="discountAmount" value={discountAmount} />

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard/transaksi"
                className="py-3 rounded-xl border text-center hover:bg-gray-50 transition"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={cart.length === 0}
                className="py-3 rounded-xl bg-gray-900 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition"
              >
                Proses Bayar
              </button>
            </div>

            {state?.message && (
              <p className="text-xs text-red-500 mt-2 text-center">
                {state.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}