// File: app/page.tsx
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { lusitana } from "@/app/ui/fonts";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beranda | 110 Coffee",
  description: "Selamat datang di 110 Coffee.",
};

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 grid grow grid-cols-1 gap-4 md:grid-cols-5">
        
        {/* KIRI */}
        <section className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:col-span-2 md:px-10">
          <p
            className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
          >
            <strong>Selamat datang di Sistem Manajemen 110 Coffee . </strong> 
          
          </p>

          <Link
            href="/login"
            className="flex items-center gap-5 self-start rounded-lg bg-rose-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-pink-500 md:text-base"
          >
            <span>Lihat Dashboard 110 Coffee</span>
            <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </section>

        {/* KANAN */}
       <section className="flex flex-col justify-center gap-6 rounded-lg bg-white px-6 py-10 md:col-span-3 md:px-10">
          <div className="relative w-full h-[320px] md:h-full flex items-center justify-center p-4">
            <Image
              src="/110 logo.png"
              alt="Gambar 110 Coffee"
              fill
              priority
              className="object-contain" 
              sizes="(min-width: 768px) 60vw, 100vw"
            />
          </div>
        </section>
      </div>
    </main>
  );
}
