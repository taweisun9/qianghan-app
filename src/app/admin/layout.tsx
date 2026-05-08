'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Users, FileSpreadsheet, Briefcase, Calendar, FolderOpen, UserCheck, DollarSign, Truck, Menu, X, LogOut } from 'lucide-react';

const NAV_GROUPS = [
  {
    title: '日常管理',
    items: [
      { id: 'dashboard', label: '儀表板', icon: TrendingUp, path: '/admin/dashboard' },
      { id: 'cases', label: '案件管理', icon: FolderOpen, path: '/admin/cases' },
      { id: 'workers', label: '工人管理', icon: Users, path: '/admin/workers' },
      { id: 'reports', label: '工時報表', icon: FileSpreadsheet, path: '/admin/reports' },
      { id: 'jobs', label: '派工管理', icon: Briefcase, path: '/admin/jobs' },
    ],
  },
  {
    title: '客戶 & 財務',
    items: [
      { id: 'customers', label: '客戶資料庫', icon: UserCheck, path: '/admin/customers' },
      { id: 'bookings', label: '客戶預約', icon: Calendar, path: '/admin/bookings' },
      { id: 'finance', label: '財務記帳', icon: DollarSign, path: '/admin/finance' },
      { id: 'vehicles', label: '車輛管理', icon: Truck, path: '/admin/vehicles' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <aside
        className={`${
          mobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } fixed md:relative inset-y-0 left-0 z-40 w-64 bg-stone-900 text-white p-5 overflow-y-auto transition-transform`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-700 rounded flex items-center justify-center font-black">悍</div>
            <div>
              <div className="font-black">強悍後台</div>
              <div className="text-xs opacity-60">管理系統</div>
            </div>
          </Link>
          <button onClick={() => setMobileMenu(false)} className="md:hidden">
            <X size={20} />
          </button>
        </div>

        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="mb-5">
            <div className="text-xs opacity-50 mb-2 tracking-widest">{group.title}</div>
            <nav className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => setMobileMenu(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded transition ${
                      isActive ? 'bg-red-700 font-bold' : 'hover:bg-stone-800'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        <div className="mt-6 pt-6 border-t border-stone-800">
          <div className="bg-stone-800 rounded p-3 mb-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700 rounded-full flex items-center justify-center font-black">劉</div>
            <div>
              <div className="font-bold text-sm">劉加明</div>
              <div className="text-xs opacity-60">負責人</div>
            </div>
          </div>
          <Link href="/" className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-800 rounded">
            <LogOut size={16} /> 回前台
          </Link>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Main */}
      <main className="flex-1 p-4 md:p-8 max-w-full overflow-x-hidden">
        <div className="md:hidden mb-4">
          <button onClick={() => setMobileMenu(true)} className="bg-stone-900 text-white p-2 rounded">
            <Menu size={20} />
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
