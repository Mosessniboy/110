'use client';

import { useState } from 'react';
import { useActionState } from 'react';
import { updateMenu } from '@/app/lib/actions';
import { Stock, Menu } from '@/app/lib/definitions';
import { Plus, Trash, Utensils } from 'lucide-react';
import Link from 'next/link';

export default function EditMenuForm({ stocks, menu }: { stocks: Stock[], menu: Menu }) {
  const updateMenuWithId = updateMenu.bind(null, menu.id);
  const [state, formAction] = useActionState(updateMenuWithId, null);

  // INISIALISASI RESEP DARI DATABASE
  const initialRecipes = menu.recipes?.map(r => ({
    stock_id: r.stock_id || '',
    stock_name: r.stock_name,
    unit: r.unit,
    amount: r.amount_needed || 0
  })) || [];

  const [recipes, setRecipes] = useState(initialRecipes);
  const [selectedStockId, setSelectedStockId] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [recipeError, setRecipeError] = useState<string | null>(null);

  const handleAddRecipe = () => {
    setRecipeError(null);
    if (!selectedStockId || !amountInput) return;
    
    // Validasi Duplikat
    if (recipes.some(r => r.stock_id === selectedStockId)) {
        setRecipeError("Bahan ini sudah ada di list.");
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
      <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Informasi Menu</h2>
      
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div>
            <label className="block text-sm font-medium mb-2">Nama Menu</label>
            <input name="name" defaultValue={menu.name} className="w-full rounded-md border border-gray-200 p-2 text-sm outline-pink-500" />
        </div>
        <div>
            <label className="block text-sm font-medium mb-2">Harga Jual (Rp)</label>
            <input name="price" type="number" defaultValue={menu.price} className="w-full rounded-md border border-gray-200 p-2 text-sm outline-pink-500" />
        </div>
       
        {/* ✅ Hidden description field - preserve existing value */}
        <input type="hidden" name="description" value={menu.description || '-'} />
      </div>

      <hr className="border-gray-100 my-6" />

      <div className="mb-6">
        <h3 className="text-sm font-bold text-pink-600 mb-4 flex items-center gap-2">
            <Utensils className="w-4 h-4" /> Edit Resep / Bahan Baku
        </h3>
        
        <div className="flex gap-2 items-end mb-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Pilih Bahan Stok</label>
                <select 
                    value={selectedStockId} 
                    onChange={(e) => setSelectedStockId(e.target.value)}
                    className="w-full rounded-md border border-gray-200 p-2 text-sm"
                >
                    <option value="">-- Tambah Bahan Baru --</option>
                    {stocks.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.unit})</option>
                    ))}
                </select>
            </div>
            <div className="w-32">
                <label className="text-xs text-gray-500 mb-1 block">Jml</label>
                <input 
                    type="number" 
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full rounded-md border border-gray-200 p-2 text-sm"
                />
            </div>
            <button type="button" onClick={handleAddRecipe} className="bg-pink-600 text-white p-2 rounded-md hover:bg-pink-500">
                <Plus className="w-5 h-5" />
            </button>
        </div>

        {recipeError && <p className="text-red-500 text-xs font-bold mb-4">⚠️ {recipeError}</p>}

        <div className="space-y-2">
            {recipes.map((recipe, index) => (
                <div key={index} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-md shadow-sm">
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

      {state?.message && (
         <p className="mb-4 text-sm text-red-500">{state.message}</p>
      )}

      <div className="flex justify-end gap-3">
        <Link href="/dashboard/menu" className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm">Batal</Link>
        <button type="submit" className="px-4 py-2 rounded-lg bg-pink-600 text-white text-sm font-medium hover:bg-pink-500">Update Menu</button>
      </div>
    </form>
  );
}