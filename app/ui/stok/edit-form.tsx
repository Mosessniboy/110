'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { updateStock, StockState } from '@/app/lib/actions';
import { Stock } from '@/app/lib/definitions';
import { Package, Layers, DollarSign } from 'lucide-react';

export default function EditStockForm({ stock }: { stock: Stock }) {
  const updateStockWithId = updateStock.bind(null, stock.id);
  
  const initialState: StockState = { message: null, errors: {}, values: {} };
  const [state, formAction] = useActionState(updateStockWithId, initialState);

  return (
    <form action={formAction} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      
      {/* --- NAMA BAHAN --- */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-900">Nama Bahan</label>
        <div className="relative">
          <Package className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            name="name"
            type="text"
            defaultValue={state.values?.name ? String(state.values.name) : stock.name}
            className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 focus:border-pink-500 focus:ring-pink-500"
          />
        </div>
        <div aria-live="polite">
          {state.errors?.name && (
            <p className="mt-2 text-sm text-red-500">{state.errors.name[0]}</p>
          )}
        </div>
      </div>

      {/* --- SATUAN --- */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-900">Satuan</label>
        <div className="relative">
          <Layers className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <select
            name="unit"
            defaultValue={state.values?.unit ? String(state.values.unit) : stock.unit}
            className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 focus:border-pink-500 focus:ring-pink-500 bg-white"
          >
            <option value="gram">Gram (g)</option>
            <option value="ml">Mililiter (ml)</option>
            <option value="pcs">Pieces (pcs)</option>
            <option value="lembar">Lembar</option>
          </select>
        </div>
        <div aria-live="polite">
          {state.errors?.unit && (
            <p className="mt-2 text-sm text-red-500">{state.errors.unit[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
        {/* --- STOK SAAT INI --- */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900">Stok Saat Ini</label>
          <input
            name="stock"
            type="number"
            step="0.01"
            defaultValue={state.values?.stock ?? stock.stock}
            className="block w-full rounded-md border border-gray-200 py-2 px-4 text-sm outline-2 focus:border-pink-500 focus:ring-pink-500"
          />
          <div aria-live="polite">
            {state.errors?.stock && (
              <p className="mt-2 text-sm text-red-500">{state.errors.stock[0]}</p>
            )}
          </div>
        </div>

        {/* --- STOK MINIMUM --- */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-900">Stok Minimum</label>
          <input
            name="min_stock"
            type="number"
            step="0.01"
            defaultValue={state.values?.min_stock ?? stock.min_stock}
            className="block w-full rounded-md border border-gray-200 py-2 px-4 text-sm outline-2 focus:border-pink-500 focus:ring-pink-500"
          />
          <div aria-live="polite">
            {state.errors?.min_stock && (
              <p className="mt-2 text-sm text-red-500">{state.errors.min_stock[0]}</p>
            )}
          </div>
        </div>
      </div>

      {/* --- HARGA PER UNIT --- */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2 text-gray-900">
          Harga Per Unit <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            name="cost_per_unit"
            type="number"
            step="0.01"
            min="0"
            defaultValue={state.values?.cost_per_unit ?? stock.cost_per_unit}
            placeholder="Masukkan harga per unit"
            required
            className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 focus:border-pink-500 focus:ring-pink-500"
          />
        </div>
        <div aria-live="polite">
          {state.errors?.cost_per_unit && (
            <p className="mt-2 text-sm text-red-500">{state.errors.cost_per_unit[0]}</p>
          )}
        </div>
      </div>
    
      <div aria-live="polite" className="mb-4">
        {state.message && (
          <p className="text-sm text-red-500 font-bold bg-red-50 p-2 rounded border border-red-200">
            {state.message}
          </p>
        )}
      </div>

      {/* --- TOMBOL AKSI --- */}
      <div className="flex justify-end gap-4">
        <Link 
          href="/dashboard/stok" 
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Batal
        </Link>
        <button 
          type="submit" 
          className="flex h-10 items-center rounded-lg bg-pink-600 px-4 text-sm font-medium text-white transition-colors hover:bg-pink-500 shadow-md shadow-pink-200"
        >
          Update Data
        </button>
      </div>
    </form>
  );
}