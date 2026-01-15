'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Calendar, ChevronDown } from 'lucide-react';
import { useState, useTransition } from 'react';

export default function YearSelector({ defaultYear }: { defaultYear: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  
  const selectedYear = searchParams.get('year') 
    ? parseInt(searchParams.get('year')!) 
    : defaultYear;

  const handleYearChange = (year: number) => {
    setIsOpen(false);
    
    console.log('🔄 [YearSelector] Changing year to:', year);
    
    // ✅ FIX: Force refresh dengan router.refresh() setelah URL update
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('year', year.toString());
      const newUrl = `${pathname}?${params.toString()}`;
      
      console.log('🔄 [YearSelector] New URL:', newUrl);
      
      // Update URL
      router.push(newUrl);
      
      // ✅ Force server component re-render
      router.refresh();
    });
  };

  return (
    <div className="relative">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`
          flex items-center gap-3 px-4 py-2.5 
          bg-white border-2 border-pink-200 rounded-lg 
          hover:border-pink-400 hover:shadow-md
          transition-all duration-200
          ${isPending ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        `}
      >
        <Calendar className="w-5 h-5 text-pink-600" />
        <span className="font-semibold text-gray-700 min-w-[60px] text-left">
          {isPending ? 'Loading...' : selectedYear}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown List */}
          <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                disabled={isPending}
                className={`
                  w-full px-4 py-2.5 text-left 
                  transition-colors duration-150
                  ${isPending ? 'cursor-wait opacity-50' : ''}
                  ${selectedYear === year 
                    ? 'bg-pink-100 text-pink-700 font-semibold border-l-4 border-pink-500' 
                    : 'text-gray-700 hover:bg-pink-50'
                  }
                `}
              >
                {year}
                {selectedYear === year && (
                  <span className="ml-2 text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Loading Indicator */}
      {isPending && (
        <div className="absolute top-full mt-2 left-0 right-0 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-600 text-xs rounded-full">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Memuat data...
          </div>
        </div>
      )}
    </div>
  );
}