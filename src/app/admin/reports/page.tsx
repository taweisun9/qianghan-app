'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { getWorkers, getMonthClockRecords } from '@/lib/supabase';

export default function ReportsPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([getWorkers(), getMonthClockRecords()]).then(([w, r]) => {
      setWorkers(w);
      setRecords(r);
    });
  }, []);

  const calcStats = (workerId: number, hourlyRate: number) => {
    const wRecords = records.filter((r) => r.worker_id === workerId);
    const days = new Set<string>();
    const pairs: Record<string, { in?: any; out?: any }> = {};
    wRecords.forEach((r) => {
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
    return { days: days.size, hours: Math.round(totalHours), salary: Math.round(totalHours * hourlyRate) };
  };

  const exportCSV = () => {
    const rows = [['工號', '姓名', '出勤天數', '總工時', '時薪', '本月薪資']];
    workers.forEach((w) => {
      const s = calcStats(w.id, w.hourly_rate);
      rows.push([w.worker_code, w.name, s.days.toString(), s.hours.toString(), w.hourly_rate.toString(), s.salary.toString()]);
    });
    const csv = '\uFEFF' + rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `工時報表_${new Date().getFullYear()}_${new Date().getMonth() + 1}.csv`;
    a.click();
  };

  const totalDays = workers.reduce((sum, w) => sum + calcStats(w.id, w.hourly_rate).days, 0);
  const totalHours = workers.reduce((sum, w) => sum + calcStats(w.id, w.hourly_rate).hours, 0);
  const totalSalary = workers.reduce((sum, w) => sum + calcStats(w.id, w.hourly_rate).salary, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-black">工時報表</h1>
        <div className="flex gap-2">
          <span className="border border-stone-300 rounded px-3 py-2 text-sm">
            {new Date().getFullYear()} 年 {new Date().getMonth() + 1} 月
          </span>
          <button onClick={exportCSV} className="bg-green-600 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2">
            <Download size={16} /> 匯出 Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-900 text-white text-xs">
              <tr>
                <th className="text-left p-4">工號</th>
                <th className="text-left p-4">姓名</th>
                <th className="text-right p-4">出勤天數</th>
                <th className="text-right p-4">總工時</th>
                <th className="text-right p-4">時薪</th>
                <th className="text-right p-4">本月薪資</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => {
                const s = calcStats(w.id, w.hourly_rate);
                return (
                  <tr key={w.id} className="border-t border-stone-100 hover:bg-stone-50">
                    <td className="p-4 font-mono text-stone-500">{w.worker_code}</td>
                    <td className="p-4 font-bold">{w.name}</td>
                    <td className="p-4 text-right">{s.days}</td>
                    <td className="p-4 text-right font-bold">{s.hours}</td>
                    <td className="p-4 text-right">${w.hourly_rate}</td>
                    <td className="p-4 text-right font-black text-red-700">${s.salary.toLocaleString()}</td>
                  </tr>
                );
              })}
              <tr className="bg-stone-100 font-black">
                <td colSpan={2} className="p-4">合計</td>
                <td className="p-4 text-right">{totalDays}</td>
                <td className="p-4 text-right">{totalHours}</td>
                <td className="p-4"></td>
                <td className="p-4 text-right text-red-700">${totalSalary.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
