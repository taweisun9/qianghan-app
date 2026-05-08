'use client';

import { useEffect, useState } from 'react';
import { getWorkers, getTodayClockRecords, getMonthClockRecords, getCases, getFinanceRecords, getBookings } from '@/lib/supabase';

export default function DashboardPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [todayRecords, setTodayRecords] = useState<any[]>([]);
  const [monthRecords, setMonthRecords] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [finance, setFinance] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getWorkers(),
      getTodayClockRecords(),
      getMonthClockRecords(),
      getCases(),
      getFinanceRecords(),
      getBookings(),
    ]).then(([w, t, m, c, f, b]) => {
      setWorkers(w);
      setTodayRecords(t);
      setMonthRecords(m);
      setCases(c);
      setFinance(f);
      setBookings(b);
      setLoading(false);
    });
  }, []);

  // 計算每個工人今日狀態
  const workerStatus = workers.map((w) => {
    const records = todayRecords.filter((r) => r.worker_id === w.id);
    const lastRecord = records[0];
    const isWorking = lastRecord?.type === 'clock_in';
    let hours = 0;
    if (records.length >= 2 && records[0].type === 'clock_out' && records[1].type === 'clock_in') {
      hours = (new Date(records[0].clock_time).getTime() - new Date(records[1].clock_time).getTime()) / 1000 / 3600;
    } else if (isWorking && lastRecord) {
      hours = (Date.now() - new Date(lastRecord.clock_time).getTime()) / 1000 / 3600;
    }
    return { ...w, isWorking, hours: hours.toFixed(1), location: lastRecord?.location };
  });

  const workingCount = workerStatus.filter((w) => w.isWorking).length;

  // 月度工時
  const monthHoursByWorker: Record<number, number> = {};
  const pairsByWorker: Record<number, Record<string, { in?: any; out?: any }>> = {};

  monthRecords.forEach((r) => {
    if (!pairsByWorker[r.worker_id]) pairsByWorker[r.worker_id] = {};
    const day = r.clock_time.split('T')[0];
    if (!pairsByWorker[r.worker_id][day]) pairsByWorker[r.worker_id][day] = {};
    if (r.type === 'clock_in') pairsByWorker[r.worker_id][day].in = r;
    if (r.type === 'clock_out') pairsByWorker[r.worker_id][day].out = r;
  });

  Object.entries(pairsByWorker).forEach(([wid, days]) => {
    let total = 0;
    Object.values(days).forEach((p) => {
      if (p.in && p.out) {
        total += (new Date(p.out.clock_time).getTime() - new Date(p.in.clock_time).getTime()) / 1000 / 3600;
      }
    });
    monthHoursByWorker[parseInt(wid)] = total;
  });

  const totalMonthHours = Object.values(monthHoursByWorker).reduce((a, b) => a + b, 0);

  // 財務統計
  const totalIncome = finance.filter((f) => f.type === 'income').reduce((a, b) => a + b.amount, 0);
  const totalExpense = finance.filter((f) => f.type === 'expense').reduce((a, b) => a + b.amount, 0);
  const netProfit = totalIncome - totalExpense;

  // 預約
  const newBookings = bookings.filter((b) => b.status === 'new').length;

  if (loading) {
    return <div className="text-center py-20 text-stone-500">載入中...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black mb-1">儀表板</h1>
        <div className="text-sm text-stone-500">
          {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })} · 早安!劉老闆
        </div>
      </div>

      {/* 4 大指標 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: '今日上工', value: `${workingCount}/${workers.length}`, sub: '人', color: 'bg-green-50 border-green-300 text-green-700' },
          { label: '本月營收', value: totalIncome >= 1000 ? `${Math.round(totalIncome / 1000)}K` : `${totalIncome}`, sub: 'NTD', color: 'bg-red-50 border-red-300 text-red-700' },
          { label: '本月支出', value: totalExpense >= 1000 ? `${Math.round(totalExpense / 1000)}K` : `${totalExpense}`, sub: 'NTD', color: 'bg-orange-50 border-orange-300 text-orange-700' },
          { label: '本月淨利', value: Math.abs(netProfit) >= 1000 ? `${Math.round(netProfit / 1000)}K` : `${netProfit}`, sub: 'NTD', color: 'bg-blue-50 border-blue-300 text-blue-700' },
        ].map((c, i) => (
          <div key={i} className={`border-2 ${c.color} rounded-xl p-5`}>
            <div className="text-xs font-bold opacity-80 mb-1 tracking-widest">{c.label}</div>
            <div className="text-3xl md:text-4xl font-black">{c.value}</div>
            <div className="text-xs opacity-60 mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* 新預約提醒 */}
      {newBookings > 0 && (
        <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <div className="font-black text-red-700">🔔 你有 {newBookings} 個新預約!</div>
            <div className="text-sm text-red-600">趕快回覆客戶</div>
          </div>
          <a href="/admin/bookings" className="bg-red-700 text-white px-4 py-2 rounded font-bold text-sm">前往處理 →</a>
        </div>
      )}

      {/* 今日打卡狀況 */}
      <div className="bg-white rounded-xl border border-stone-200 mb-6 overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-black text-lg">今日打卡狀況</h2>
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">即時更新</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 text-stone-600 text-xs">
              <tr>
                <th className="text-left p-4">工人</th>
                <th className="text-left p-4">狀態</th>
                <th className="text-left p-4">工作地點</th>
                <th className="text-right p-4">今日工時</th>
              </tr>
            </thead>
            <tbody>
              {workerStatus.map((w) => (
                <tr key={w.id} className="border-t border-stone-100 hover:bg-stone-50">
                  <td className="p-4 font-bold">{w.name}</td>
                  <td className="p-4">
                    {w.isWorking ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">🟢 工作中</span>
                    ) : (
                      <span className="bg-stone-100 text-stone-600 px-2 py-1 rounded text-xs font-bold">⚪ 未上工</span>
                    )}
                  </td>
                  <td className="p-4 text-stone-600">{w.location || '-'}</td>
                  <td className="p-4 text-right font-black">{w.hours} h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 月度工時排行 */}
      <div className="bg-white rounded-xl border border-stone-200 p-5">
        <h2 className="font-black text-lg mb-5">本月工時排行</h2>
        <div className="space-y-3">
          {workers
            .map((w) => ({ ...w, monthHours: monthHoursByWorker[w.id] || 0 }))
            .sort((a, b) => b.monthHours - a.monthHours)
            .map((w, i) => (
              <div key={w.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold">{i + 1}. {w.name}</span>
                  <span className="text-stone-600">{w.monthHours.toFixed(1)} 小時</span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-700 to-red-500"
                    style={{ width: `${Math.min((w.monthHours / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          {totalMonthHours === 0 && (
            <div className="text-center text-stone-400 py-8 text-sm">本月還沒有打卡記錄</div>
          )}
        </div>
      </div>
    </div>
  );
}
