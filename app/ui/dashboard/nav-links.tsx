"use client";

import {
  UserGroupIcon,
  HomeIcon,
  InboxIcon,
  DocumentDuplicateIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  BanknotesIcon, // ← Import icon untuk Pengeluaran
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useEffect, useState } from "react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Pelanggan", href: "/dashboard/pelanggan", icon: UserGroupIcon },
  { name: "Stok Bahan", href: "/dashboard/stok", icon: ArchiveBoxIcon },
  { name: "Menu", href: "/dashboard/menu", icon: InboxIcon },
  { name: "Transaksi", href: "/dashboard/transaksi", icon: CurrencyDollarIcon },
  { name: "Pengeluaran", href: "/dashboard/pengeluaran", icon: BanknotesIcon }, // ← Tambahkan ini
  { name: "Laporan", href: "/dashboard/laporan", icon: DocumentDuplicateIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  // State untuk tanggal
  const [today, setToday] = useState("");

  useEffect(() => {
    const date = new Date();

    const formatted = date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    setToday(formatted);
  }, []);

  return (
    <div className="flex justify-between items-center w-full">
      {/* LEFT — LINKS */}
      <nav className="flex gap-1 overflow-x-auto scrollbar-none">
        {links.map((link) => {
          const LinkIcon = link.icon;

          const active = link.name === "Dashboard"
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(link.href + "/");

          return (
            <Link
              key={link.name}
              href={link.href}
              className={clsx(
                "whitespace-nowrap rounded-lg px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-pink-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <span className="inline-flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                <span>{link.name}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* RIGHT — TANGGAL */}
      <div className="text-sm text-gray-600 whitespace-nowrap ml-auto pl-4">
        {today}
      </div>
    </div>
  );
}