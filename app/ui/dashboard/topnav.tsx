import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import { House } from "lucide-react";
import Image from "next/image";
import { auth } from "@/app/lib/auth";

export default async function TopNav() {
  // Get user session and role
  const session = await auth();
  const userRole = session?.user?.role || 'staff';
  const userName = session?.user?.name || 'User';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-200/40 bg-gradient-to-r bg-pink-500 backdrop-blur">
      <div className="mx-auto max-w-7xl px-3 py-3 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Dashboard" className="flex items-center gap-3 text-white">
            <div className="flex-shrink-0">
              <Image
                src="/logo.jpg"
                alt="Inventory Logo"
                width={40}
                height={40}
                className="h-8 w-auto md:h-10 object-contain"
              />
            </div>

            <div className="hidden md:block">
              <strong className="text-lg">110 Coffee</strong>
              <span className="text-xs opacity-90 block mt-1">Cuan Cuann!</span>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-3">
            {/* User Info & Role Badge */}
            <div className="hidden md:flex items-center gap-3 mr-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{userName}</p>
                <p className="text-xs text-white/80">{session?.user?.email}</p>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm ${
                  userRole === 'admin'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border border-purple-400'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border border-blue-400'
                }`}
              >
                {userRole === 'admin' ? '👑' : '👤'}
                <span>{userRole === 'admin' ? 'Admin' : 'Staff'}</span>
              </div>
            </div>

            {/* Mobile: Role Badge Only */}
            <div className="md:hidden">
              <div
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  userRole === 'admin'
                    ? 'bg-purple-500/20 text-white border border-purple-400/50'
                    : 'bg-blue-500/20 text-white border border-blue-400/50'
                }`}
              >
                {userRole === 'admin' ? '👑' : '👤'}
              </div>
            </div>

            {/* Home Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              title="Sign Out"
            >
              <House className="h-5 w-5" aria-hidden="true" />
              <span className="hidden md:inline">Beranda</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-3 py-2 md:px-6">
          <NavLinks />
        </div>
      </div>
    </header>
  );
}