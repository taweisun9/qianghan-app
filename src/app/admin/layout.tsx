'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Users, FileSpreadsheet, Briefcase, Calendar, FolderOpen, UserCheck, DollarSign, Truck, Menu, X, LogOut } from 'lucide-react';

// ⚠️ 改密碼就改這裡
const ADMIN_PASSWORD = 'qianghan2026';

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
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  // 檢查是否已登入
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('qianghan_admin_auth');
      if (saved === 'yes') setAuthed(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('qianghan_admin_auth', 'yes');
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('qianghan_admin_auth');
    setAuthed(false);
    setPassword('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="text-stone-500">載入中...</div>
      </div>
    );
  }

  // === 未登入:顯示密碼輸入畫面 ===
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-800 via-red-700 to-red-900 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-700 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white font-black text-3xl">
              悍
            </div>
            <h1 className="text-2xl font-black mb-1">強悍後台</h1>
            <p className="text-sm text-stone-500">管理系統登入</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">管理員密碼</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="請輸入密碼"
                className={`w-full px-4 py-3 border-2 rounded-lg outline-none text-lg ${
                  error ? 'border-red-500 bg-red-50' : 'border-stone-300 focus:border-red-700'
                }`}
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-2">❌ 密碼錯誤,請再試一次</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-red-700 text-white py-3 rounded-lg font-black text-lg hover:bg-red-800 transition"
            >
              🔓 登入
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-100 text-center text-xs text-stone-400">
            <p>強悍割草班 © 2026</p>
            <p className="mt-1">忘記密碼請聯絡系統管理員</p>
          </div>
        </div>
      </div>
    );
  }

  // === 已登入:顯示後台 ===
  return (
    <div className="min-h-screen bg-stone-100 flex">
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
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-800 rounded text-red-300">
            <LogOut size={16} /> 登出
          </button>
          <Link href="/" className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-stone-800 rounded mt-1">
            🌐 回前台
          </Link>
        </div>
      </aside>

      {mobileMenu && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenu(false)}
        />
      )}

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
