'use client';

import { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { getCustomers, createCustomer } from '@/lib/supabase';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', area: '台東市', tag: 'new' });

  useEffect(() => {
    getCustomers().then(setCustomers);
  }, []);

  const filtered = customers.filter((c) =>
    !search ||
    c.name.includes(search) ||
    c.phone?.includes(search) ||
    c.area?.includes(search)
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCustomer(form);
    setShowAdd(false);
    setForm({ name: '', phone: '', area: '台東市', tag: 'new' });
    getCustomers().then(setCustomers);
  };

  const stats = {
    total: customers.length,
    regular: customers.filter((c) => c.tag === 'regular').length,
    vip: customers.filter((c) => c.tag === 'vip').length,
    newCount: customers.filter((c) => c.tag === 'new').length,
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black">客戶資料庫</h1>
          <div className="text-sm text-stone-500">所有服務過的客戶</div>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-red-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
          <Plus size={16} /> 新增客戶
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: '總客戶數', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: '常客', value: stats.regular, color: 'bg-green-50 text-green-700' },
          { label: '大戶', value: stats.vip, color: 'bg-purple-50 text-purple-700' },
          { label: '新客', value: stats.newCount, color: 'bg-orange-50 text-orange-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} p-4 rounded-xl text-center`}>
            <div className="text-3xl font-black">{s.value}</div>
            <div className="text-xs font-bold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 mb-4 p-3 flex items-center gap-3">
        <Search size={18} className="text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋客戶姓名、電話、地區..."
          className="flex-1 outline-none text-sm"
        />
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs">
              <tr>
                <th className="text-left p-4">客戶</th>
                <th className="text-left p-4">電話</th>
                <th className="text-left p-4">地區</th>
                <th className="text-left p-4">標籤</th>
                <th className="text-right p-4">服務次數</th>
                <th className="text-right p-4">累積金額</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-stone-100 hover:bg-stone-50">
                  <td className="p-4 font-bold">{c.name}</td>
                  <td className="p-4 text-stone-600">{c.phone || '-'}</td>
                  <td className="p-4 text-stone-600">{c.area || '-'}</td>
                  <td className="p-4">
                    {c.tag === 'vip' && <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-bold">💎 大戶</span>}
                    {c.tag === 'regular' && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">⭐ 常客</span>}
                    {c.tag === 'new' && <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-bold">🆕 新客</span>}
                  </td>
                  <td className="p-4 text-right font-bold">{c.visit_count} 次</td>
                  <td className="p-4 text-right font-black text-red-700">${c.total_amount?.toLocaleString() || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black mb-5">新增客戶</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><label className="block text-sm font-bold mb-1">姓名</label><input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none" /></div>
              <div><label className="block text-sm font-bold mb-1">電話</label><input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none" /></div>
              <div><label className="block text-sm font-bold mb-1">地區</label>
                <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none">
                  {['台東市', '卑南鄉', '太麻里鄉', '東河鄉', '成功鎮', '關山鎮', '池上鄉', '鹿野鄉'].map((a) => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 border-2 border-stone-300 py-2 rounded font-bold">取消</button>
                <button type="submit" className="flex-1 bg-red-700 text-white py-2 rounded font-bold">新增</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
