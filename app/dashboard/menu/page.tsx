import Link from 'next/link';
import { Plus } from 'lucide-react';
import { fetchMenus, fetchMenuCounts } from '@/app/lib/data';
import MenuCard from '@/app/ui/menu/menu-cards';
import MenuSummary from '@/app/ui/menu/summary-cards';
import Search from '@/app/ui/search';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu | 110 Coffee',
};

export default async function Page(props: { searchParams?: Promise<{ query?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';

  const [menus, counts] = await Promise.all([
    fetchMenus(query),
    fetchMenuCounts(),
  ]);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-pink-600">Daftar Menu</h1>
        <Link href="/dashboard/menu/create" className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-500">
          <Plus className="w-5 h-5" /> Tambah Menu
        </Link>
      </div>

      <MenuSummary data={counts} />

      <div className="mt-4">
        <Search placeholder="Cari nama menu..." />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
      </div>
      
      {menus.length === 0 && <p className="text-center text-gray-500 mt-10">Tidak ada menu ditemukan.</p>}
    </div>
  );
}