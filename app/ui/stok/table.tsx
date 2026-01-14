'use client';

import { useState } from 'react';
import { Stock } from '@/app/lib/definitions';
import { formatNumber, formatCurrency } from '@/app/lib/utils';
import StockStatusBadge from './status';
import { Pencil, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { deleteStock } from '@/app/lib/actions';
import Link from 'next/link';
import { getStockStatus } from '@/app/lib/utils';

export default function StocksTable({ stocks }: { stocks: Stock[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id: string) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedId) return;

        setIsDeleting(true);
        try {
            await deleteStock(selectedId);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Gagal menghapus', error);
            alert('Gagal menghapus data');
        } finally {
            setIsDeleting(false);
            setSelectedId(null);
        }
    };

    return (
        <>
            <div className="rounded-lg bg-pink-50 p-2 md:pt-0 mt-6">
                <table className="min-w-full text-gray-900">
                    <thead className="text-left text-sm font-normal">
                        <tr>
                            <th className="px-4 py-5 font-medium">No</th>
                            <th className="px-3 py-5 font-medium">Nama Bahan</th>
                            <th className="px-3 py-5 font-medium">Stok Tersedia</th>
                            <th className="px-3 py-5 font-medium">Stok Minimum</th>
                            <th className="px-3 py-5 font-medium">Harga / Unit</th>
                            <th className="px-3 py-5 font-medium">Status</th>
                            <th className="py-3 pl-6 pr-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {stocks.map((item, index) => {
                            const status = getStockStatus(item.stock, item.min_stock);
                            return (
                                <tr key={item.id} className="border-b py-3 text-sm hover:bg-gray-50 transition-colors">
                                    <td className="py-3 pl-6 pr-3">{index + 1}</td>
                                    <td className="px-3 py-3 font-semibold text-pink-600">{item.name}</td>
                                    <td className="px-3 py-3 font-bold text-gray-700">
                                        {formatNumber(item.stock)} <span className="font-normal text-gray-500">{item.unit}</span>
                                    </td>
                                    <td className="px-3 py-3 text-gray-500">
                                        {formatNumber(item.min_stock)} {item.unit}
                                    </td>
                                    <td className="px-3 py-3 font-bold text-gray-700">
                                        {formatCurrency(item.cost_per_unit)}
                                    </td>
                                    <td className="px-3 py-3"><StockStatusBadge status={status} /></td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex gap-3">
                                            <Link
                                                href={`/dashboard/stok/${item.id}/edit`}
                                                className="text-blue-500 hover:text-blue-700 transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(item.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                title="Hapus Item"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* MODAL KONFIRMASI HAPUS */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in transition-opacity">
                    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl transform scale-100 transition-transform">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-bold text-gray-900">Hapus Stok Bahan?</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                                disabled={isDeleting}
                            >
                                Batal
                            </button>

                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 focus:outline-none"
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
        </>
    );
}
