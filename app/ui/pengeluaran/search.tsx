'use client';

import { Search } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function ExpenseSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Cari keterangan atau kategori..."
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}