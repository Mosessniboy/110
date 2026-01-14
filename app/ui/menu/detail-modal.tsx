'use client';

import { Menu } from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import { X, ChefHat, Tag } from 'lucide-react';

export default function MenuDetailModal({ menu, onClose }: { menu: Menu; onClose: () => void }) {
  // Tambahkan log ini untuk memastikan Modal di-render
  console.log("Modal Rendered for:", menu.name);

  return (
    // Hapus 'fade-in', pastikan z-index tinggi (z-50)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Tambahkan onClick di background untuk menutup modal saat klik luar */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden z-10">
        
        {/* Header Warna Pink */}
        <div className="bg-pink-600 p-6 flex justify-between items-start">
            <div className="text-white">
                <h2 className="text-2xl font-bold">{menu.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-pink-100 text-sm">
                   <Tag className="w-4 h-4" />
                   <span>{menu.sold_count} Terjual</span>
                </div>
            </div>
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition">
                <X className="w-5 h-5" />
            </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Harga & Deskripsi */}
            <div className="mb-6">
                <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(menu.price)}</p>
                
            </div>

            {/* Resep Detail */}
            <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <ChefHat className="w-5 h-5 text-pink-600" />
                    Resep & Takaran Bahan
                </h3>
                <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 font-medium">
                            <tr>
                                <th className="p-3">Nama Bahan</th>
                                <th className="p-3 text-right">Jumlah Pakai</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {menu.recipes && menu.recipes.length > 0 ? (
                                menu.recipes.map((recipe, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="p-3 text-gray-800">{recipe.stock_name}</td>
                                        <td className="p-3 text-right font-bold text-pink-600">
                                            {recipe.amount_needed} {recipe.unit}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2} className="p-4 text-center text-gray-400 italic">
                                        Tidak ada data resep.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button onClick={onClose} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition">
                    Tutup
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}