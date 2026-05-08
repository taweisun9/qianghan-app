'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getVehicles } from '@/lib/supabase';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    getVehicles().then(setVehicles);
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black">車輛管理</h1>
          <div className="text-sm text-stone-500">每台工作車的資料、保養紀錄</div>
        </div>
        <button className="bg-red-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
          <Plus size={16} /> 新增車輛
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '總車輛數', value: vehicles.length, color: 'bg-blue-50 text-blue-700' },
          { label: '小貨車', value: vehicles.filter((v) => v.type === '小貨車').length, color: 'bg-orange-50 text-orange-700' },
          { label: '機車', value: vehicles.filter((v) => v.type === '機車').length, color: 'bg-green-50 text-green-700' },
          { label: '待保養', value: vehicles.filter((v) => v.status === 'warn').length, color: 'bg-yellow-50 text-yellow-700' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} p-4 rounded-xl text-center`}>
            <div className="text-3xl font-black">{s.value}</div>
            <div className="text-xs font-bold mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white border border-stone-200 rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${v.type === '小貨車' ? 'bg-red-100' : 'bg-blue-100'}`}>
                  {v.type === '小貨車' ? '🚚' : '🏍'}
                </div>
                <div>
                  <div className="font-black text-lg font-mono">{v.plate}</div>
                  <div className="text-xs text-stone-500">{v.type}{v.workers?.name && ` · 駕駛 ${v.workers.name}`}</div>
                </div>
              </div>
              {v.status === 'warn' && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold">⚠️ 待保養</span>}
              {v.status === 'good' && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">✅ 正常</span>}
              {v.status === 'broken' && <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold">🔴 故障</span>}
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-stone-50 rounded p-3">
                <div className="text-xs text-stone-500 mb-1">總里程</div>
                <div className="font-black">{(v.total_km || 0).toLocaleString()} km</div>
              </div>
              <div className="bg-stone-50 rounded p-3">
                <div className="text-xs text-stone-500 mb-1">下次保養</div>
                <div className="font-black text-sm">{v.next_maintain_date || '未設定'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
