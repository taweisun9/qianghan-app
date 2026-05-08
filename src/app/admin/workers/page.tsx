'use client';

import { useEffect, useState } from 'react';
import { getWorkers, getMonthClockRecords } from '@/lib/supabase';

export default function WorkersPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [monthRecords, setMonthRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getWorkers(), getMonthClockRecords()]).then(([w, m]) => {
      setWorkers(w);
      setMonthRecords(m);
      setLoading(false);
    });
  }, []);

  const calcWorkerStats = (workerId: number, hourlyRate: number) => {
    const records = monthRecords.filter((r) => r.worker_id === workerId);
    const days = new Set<string>();
    const pairs: Record<string, { in?: any; out?: any }> = {};
    records.forEach((r) => {
      const day = r.clock_time.split('T')[0];
      days.add(day);
      if (!pairs[day]) pairs[day] = {};
      if (r.type === 'clock_in') pairs[day].in = r;
      if (r.type === 'clock_out') pairs[day].out = r;
    });
    let totalHours = 0;
    Object.values(pairs).forEach((p) => {
      if (p.in && p.out) {
        totalHours += (new Date(p.out.clock_time).getTime() - new Date(p.in.clock_time).getTime()) / 1000 / 3600;
      }
    });
    return { days: days.size, hours: totalHours.toFixed(0), salary: Math.round(totalHours * hourlyRate) };
  };

  if (loading) return <div className="text-center py-20 text-stone-500">載入中...</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-black">工人管理</h1>
        <button className="bg-red-700 text-white px-4 py-2 rounded font-bold text-sm">+ 新增工人</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {workers.map((w) => {
          const stats = calcWorkerStats(w.id, w.hourly_rate);
          return (
            <div key={w.id} className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-lg transition">
              <div className="w-14 h-14 bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center text-white font-black text-2xl mb-3">
                {w.name[w.name.length - 1]}
              </div>
              <div className="font-black text-lg">{w.name}</div>
              <div className="text-xs text-stone-500 mb-3">工號 {w.worker_code}{w.role === 'admin' && ' · 管理員'}</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-stone-500">本月工時</span><span className="font-bold">{stats.hours}h</span></div>
                <div className="flex justify-between"><span className="text-stone-500">出勤天數</span><span className="font-bold">{stats.days}天</span></div>
                <div className="flex justify-between"><span className="text-stone-500">時薪</span><span className="font-bold">${w.hourly_rate}</span></div>
                <div className="flex justify-between border-t border-stone-100 pt-2 mt-2">
                  <span className="text-stone-500">本月薪資</span>
                  <span className="font-black text-red-700">${stats.salary.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
