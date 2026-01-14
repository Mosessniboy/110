'use client';

import { useState } from 'react';
import { Menu } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import { Pencil, Trash2, AlertTriangle, Loader2, TrendingUp, TrendingDown, ShoppingBag, Eye } from 'lucide-react';
import { deleteMenu } from '@/app/lib/actions';
import Link from 'next/link';
import MenuDetailModal from '@/app/ui/menu/detail-modal'; // import modal

export default function MenuCard({ menu }: { menu: Menu }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false); // state modal detail

  const handleDeleteClick = () => setIsModalOpen(true);
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMenu(menu.id);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Gagal menghapus', error);
      alert('Gagal menghapus menu');
    } finally {
      setIsDeleting(false);
    }
  };

  // Kalkulasi HPP & Margin
  const price = Number(menu.price);
  const hpp = Number(menu.hpp) || 0;
  const profit = price - hpp;
  const margin = price > 0 ? ((price - hpp) / price) * 100 : 0;

  const getMarginColor = () => {
    if (margin >= 50) return 'bg-green-100 text-green-700 border-green-200';
    if (margin >= 30) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (margin >= 15) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-pink-600">{menu.name}</h3>
          </div>
          <div className="flex gap-2 ml-2">
            <button
              onClick={() => setIsDetailOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              title="Detail Menu"
            >
              <Eye className="w-4 h-4" />
            </button>

            <Link
              href={`/dashboard/menu/${menu.id}/edit`}
              className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </Link>

            <button
              onClick={handleDeleteClick}
              className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Resep */}
        {menu.recipes && menu.recipes.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-600 mb-2">Resep:</p>
            <div className="space-y-1">
              {menu.recipes.slice(0, 3).map((recipe, i) => (
                <div key={i} className="text-xs text-gray-600 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-pink-400"></span>
                  {recipe.stock_name} ({recipe.amount_needed} {recipe.unit})
                </div>
              ))}
              {menu.recipes.length > 3 && (
                <p className="text-xs text-gray-400 italic mt-1">
                  +{menu.recipes.length - 3} bahan lagi
                </p>
              )}
            </div>
          </div>
        )}

        {/* Pricing Info */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">HPP</span>
            <span className="font-semibold text-gray-700">{formatCurrency(hpp)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Harga Jual</span>
            <span className="text-lg font-bold text-gray-900">{formatCurrency(price)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Profit</span>
            <span className="font-semibold text-green-600">+{formatCurrency(profit)}</span>
          </div>
        </div>

        {/* Margin & Terjual */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border ${getMarginColor()}`}>
            {margin >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            Margin {margin.toFixed(1)}%
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <ShoppingBag className="w-4 h-4" />
            <span className="font-semibold">{menu.sold_count}</span>
            <span className="text-gray-400">terjual</span>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI HAPUS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900">Hapus Menu?</h3>
              <p className="mt-2 text-sm text-gray-500">
                Menu "{menu.name}" akan dihapus. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isDeleting}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  'Ya, Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DETAIL */}
      {isDetailOpen && <MenuDetailModal menu={menu} onClose={() => setIsDetailOpen(false)} />}
    </>
  );
}
