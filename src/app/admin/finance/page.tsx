'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getFinanceRecords, createFinanceRecord } from '@/lib/supabase';

export default function FinancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<'income' | 'expense'>('income');
  const [form, setForm] = useState({ amount: 0, category: '案件收入', description: '' });

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => getFinanceRecords().then(setRecords);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFinanceRecord({
      type: addType,
      category: form.category,
      amount: form.amount,
      description: form.description,
      record_date: new Date().toISOString().split('T')[0],
    });
    setShowAdd(false);
    setForm({ amount: 0, category: '案件收入', description: '' });
    refresh();
  };

  const incomeRecords = records.filter((r) => r.type === 'income');
  const expenseRecords = records.filter((r) => r.type === 'expense');
  const totalIncome = incomeRecords.reduce((a, b) => a + b.amount, 0);
  const totalExpense = expenseRecords.reduce((a, b) => a + b.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black">財務記帳</h1>
          <div className="text-sm text-stone-500">收入、支出、油料費、工資</div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setAddType('income'); setForm({ amount: 0, category: '案件收入', description: '' }); setShowAdd(true); }} className="bg-green-600 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
            <Plus size={16} /> 收入
          </button>
          <button onClick={() => { setAddType('expense'); setForm({ amount: 0, category: '油料', description: '' }); setShowAdd(true); }} className="bg-orange-600 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
            <Plus size={16} /> 支出
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border-2 border-green-300 p-5 rounded-xl">
          <div className="text-xs font-bold text-green-700 tracking-widest mb-1">本月收入</div>
          <div className="text-3xl font-black text-green-700">NT$ {totalIncome.toLocaleString()}</div>
        </div>
        <div className="bg-orange-50 border-2 border-orange-300 p-5 rounded-xl">
          <div className="text-xs font-bold text-orange-700 tracking-widest mb-1">本月支出</div>
          <div className="text-3xl font-black text-orange-700">NT$ {totalExpense.toLocaleString()}</div>
        </div>
        <div className="bg-red-50 border-2 border-red-300 p-5 rounded-xl">
          <div className="text-xs font-bold text-red-700 tracking-widest mb-1">本月淨利</div>
          <div className="text-3xl font-black text-red-700">NT$ {netProfit.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="bg-green-600 text-white p-4 font-black">📈 收入明細 ({incomeRecords.length})</div>
          {incomeRecords.length === 0 ? (
            <div className="p-8 text-center text-stone-400">沒有收入記錄</div>
          ) : (
            <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
              {incomeRecords.map((r) => (
                <div key={r.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold">{r.description}</div>
                    <div className="text-xs text-stone-500">{r.record_date} · {r.category}</div>
                  </div>
                  <div className="font-black text-green-700">+NT$ {r.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
          <div className="bg-orange-600 text-white p-4 font-black">📉 支出明細 ({expenseRecords.length})</div>
          {expenseRecords.length === 0 ? (
            <div className="p-8 text-center text-stone-400">沒有支出記錄</div>
          ) : (
            <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto">
              {expenseRecords.map((r) => (
                <div key={r.id} className="p-4 flex items-center justify-between">
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      {r.description}
                      <span className={`text-xs px-2 py-0.5 rounded ${r.category === '油料' ? 'bg-blue-100 text-blue-700' : r.category === '工資' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'}`}>{r.category}</span>
                    </div>
                    <div className="text-xs text-stone-500">{r.record_date}</div>
                  </div>
                  <div className="font-black text-orange-700">-NT$ {r.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black mb-5">新增{addType === 'income' ? '收入' : '支出'}</h3>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <label className="block text-sm font-bold mb-1">金額</label>
                <input required type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">類別</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none">
                  {addType === 'income' ? (
                    <><option>案件收入</option><option>其他收入</option></>
                  ) : (
                    <><option>油料</option><option>工資</option><option>維修</option><option>其他</option></>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">說明</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none" placeholder="例:柴油 30L" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 border-2 border-stone-300 py-2 rounded font-bold">取消</button>
                <button type="submit" className={`flex-1 text-white py-2 rounded font-bold ${addType === 'income' ? 'bg-green-600' : 'bg-orange-600'}`}>新增</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
