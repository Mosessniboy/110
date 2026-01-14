'use client';

import { useState, useActionState } from 'react';
import { createMenu } from '@/app/lib/actions';
import { Stock } from '@/app/lib/definitions';
import { Plus, Trash, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function CreateMenuForm({ stocks }: { stocks: Stock[] }) {
    const [state, formAction] = useActionState(createMenu, null);
    const [recipeError, setRecipeError] = useState<string | null>(null);
    const [recipes, setRecipes] = useState<{ stock_id: string; stock_name: string; unit: string; amount: number }[]>([]);
    const [selectedStockId, setSelectedStockId] = useState('');
    const [amountInput, setAmountInput] = useState('');

    const handleAddRecipe = () => {
        setRecipeError(null);
        if (!selectedStockId || !amountInput) return;

        const isDuplicate = recipes.some(r => r.stock_id === selectedStockId);
        if (isDuplicate) {
            setRecipeError("Bahan ini sudah ditambahkan. Edit jumlahnya atau hapus dulu.");
            return;
        }

        const stock = stocks.find(s => s.id === selectedStockId);
        if (!stock) return;

        setRecipes([...recipes, {
            stock_id: stock.id,
            stock_name: stock.name,
            unit: stock.unit,
            amount: Number(amountInput)
        }]);

        setSelectedStockId('');
        setAmountInput('');
    };

    const removeRecipe = (index: number) => {
        const newRecipes = [...recipes];
        newRecipes.splice(index, 1);
        setRecipes(newRecipes);
    };

    return (
        <form action={formAction} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">

            {/* 1. Info Dasar Menu */}
            <div className="grid gap-4 md:grid-cols-2 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Nama Menu</label>
                    <input name="name" className="w-full rounded-md border border-gray-200 p-2 text-sm outline-pink-500" placeholder="Cth: Latte" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Harga Jual (Rp)</label>
                    <input name="price" type="number" className="w-full rounded-md border border-gray-200 p-2 text-sm outline-pink-500" placeholder="0" />
                </div>
                
                {/* ✅ Hidden description field */}
                <input type="hidden" name="description" value="-" />
            </div>

            <hr className="border-gray-100 my-6" />

            {/* 2. Resep / Bahan Baku */}
            <div className="mb-6">
                <h3 className="text-sm font-bold text-pink-600 mb-4 flex items-center gap-2">
                    <Utensils className="w-4 h-4" /> Atur Resep / Bahan Baku
                </h3>

                {/* Input Penambah Bahan */}
                <div className="flex gap-2 items-end mb-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-1 block">Pilih Bahan Stok</label>
                        <select
                            value={selectedStockId}
                            onChange={(e) => setSelectedStockId(e.target.value)}
                            className="w-full rounded-md border border-gray-200 p-2 text-sm"
                        >
                            <option value="">-- Pilih Bahan --</option>
                            {stocks.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="text-xs text-gray-500 mb-1 block">Jumlah Pakai</label>
                        <input
                            type="number"
                            value={amountInput}
                            onChange={(e) => setAmountInput(e.target.value)}
                            placeholder="0"
                            className="w-full rounded-md border border-gray-200 p-2 text-sm"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleAddRecipe}
                        className="bg-pink-600 text-white p-2 rounded-md hover:bg-pink-500"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                </div>

                {recipeError && (
                    <p className="text-red-500 text-xs font-bold mb-4 bg-red-50 p-2 rounded border border-red-100">
                        ⚠️ {recipeError}
                    </p>
                )}

                {/* List Bahan yang sudah ditambahkan */}
                <div className="space-y-2">
                    {recipes.length === 0 && <p className="text-sm text-gray-400 italic text-center py-4">Belum ada bahan yang ditambahkan.</p>}

                    {recipes.map((recipe, index) => (
                        <div key={index} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-md">
                            <span className="text-sm font-medium text-gray-700">
                                {recipe.stock_name}
                                <span className="text-pink-600 ml-2 text-xs font-bold bg-pink-50 px-2 py-0.5 rounded">
                                    {recipe.amount} {recipe.unit}
                                </span>
                            </span>
                            <button type="button" onClick={() => removeRecipe(index)} className="text-red-400 hover:text-red-600">
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <input type="hidden" name="recipes" value={JSON.stringify(recipes)} />
            </div>

            {state?.message && <p className="text-red-500 text-sm mb-4">{state.message}</p>}

            <div className="flex justify-end gap-3">
                <Link href="/dashboard/menu" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm">Batal</Link>
                <button type="submit" className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-500">Simpan Menu</button>
            </div>
        </form>
    );
}