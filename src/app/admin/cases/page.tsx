'use client';

import { useEffect, useState } from 'react';
import { Plus, Image } from 'lucide-react';
import { getCases, updateCaseStatus, createCase } from '@/lib/supabase';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  quoted: { label: '📋 報價中', color: 'bg-yellow-100 text-yellow-700' },
  working: { label: '🔨 進行中', color: 'bg-green-100 text-green-700' },
  completed: { label: '✅ 已完工', color: 'bg-blue-100 text-blue-700' },
  paid: { label: '💰 已收款', color: 'bg-stone-200 text-stone-700' },
  cancelled: { label: '❌ 已取消', color: 'bg-red-100 text-red-700' },
};

export default function CasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    area: '台東市',
    service_type: '割草',
    amount: 0,
    description: '',
  });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => getCases().then(setCases);

  const handleStatusChange = async (id: number, status: string) => {
    await updateCaseStatus(id, status);
    refresh();
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCase({ ...form, status: 'quoted' });
    setShowAdd(false);
    setForm({ customer_name: '', area: '台東市', service_type: '割草', amount: 0, description: '' });
    refresh();
  };

  const filtered = filter === 'all' ? cases : cases.filter((c) => c.status === filter);

  // 統計
  const stats = {
    quoted: cases.filter((c) => c.status === 'quoted').length,
    working: cases.filter((c) => c.status === 'working').length,
    completed: cases.filter((c) => c.status === 'completed').length,
    paid: cases.filter((c) => c.status === 'paid').length,
    total: cases.length,
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black">案件管理</h1>
          <div className="text-sm text-stone-500">從報價到收款的完整流程</div>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-red-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
          <Plus size={16} /> 新增案件
        </button>
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: '報價中', count: stats.quoted, color: 'bg-yellow-100 text-yellow-700' },
          { label: '進行中', count: stats.working, color: 'bg-green-100 text-green-700' },
          { label: '已完工', count: stats.completed, color: 'bg-blue-100 text-blue-700' },
          { label: '已收款', count: stats.paid, color: 'bg-stone-100 text-stone-700' },
          { label: '本月總計', count: stats.total, color: 'bg-red-100 text-red-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} p-4 rounded-xl text-center`}>
            <div className="text-3xl font-black">{s.count}</div>
            <div className="text-xs font-bold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 篩選 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { id: 'all', label: '全部' },
          { id: 'quoted', label: '報價中' },
          { id: 'working', label: '進行中' },
          { id: 'completed', label: '已完工' },
          { id: 'paid', label: '已收款' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 rounded text-sm font-bold ${filter === f.id ? 'bg-stone-900 text-white' : 'bg-white border border-stone-300'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 案件列表 */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center text-stone-400 rounded-xl">沒有案件</div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-stone-400">{c.case_code}</span>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">{c.service_type}</span>
                    {STATUS_LABELS[c.status] && (
                      <span className={`text-xs px-2 py-1 rounded font-bold ${STATUS_LABELS[c.status].color}`}>
                        {STATUS_LABELS[c.status].label}
                      </span>
                    )}
                  </div>
                  <div className="font-black text-lg">{c.customer_name}</div>
                  <div className="text-sm text-stone-500 mt-1">📍 {c.area} · 📅 {new Date(c.created_at).toLocaleDateString()}</div>
                  {c.description && <div className="text-sm text-stone-600 mt-2">{c.description}</div>}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-red-700">NT$ {c.amount?.toLocaleString() || 0}</div>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t border-stone-100 flex-wrap">
                {c.status === 'quoted' && (
                  <button onClick={() => handleStatusChange(c.id, 'working')} className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200">開始施工</button>
                )}
                {c.status === 'working' && (
                  <button onClick={() => handleStatusChange(c.id, 'completed')} className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">標記完工</button>
                )}
                {c.status === 'completed' && (
                  <button onClick={() => handleStatusChange(c.id, 'paid')} className="text-xs px-3 py-1 bg-stone-100 text-stone-700 rounded hover:bg-stone-200">標記已收款</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 新增案件 Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black mb-5">新增案件</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-sm font-bold mb-1">客戶姓名</label>
                <input required type="text" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold mb-1">地區</label>
                  <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none">
                    {['台東市', '卑南鄉', '太麻里鄉', '東河鄉', '成功鎮', '關山鎮', '池上鄉', '鹿野鄉'].map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">服務</label>
                  <select value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none">
                    <option>割草</option><option>整地</option><option>鋸樹</option><option>工程承攬</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">金額</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">備註</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none h-20" />
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
