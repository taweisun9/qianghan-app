'use client';

import { useEffect, useState } from 'react';
import { getJobs } from '@/lib/supabase';

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-black">派工管理</h1>
        <button className="bg-red-700 text-white px-4 py-2 rounded font-bold text-sm">+ 新增派工</button>
      </div>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl">
            <div className="text-stone-400 mb-4">目前沒有派工記錄</div>
            <div className="text-sm text-stone-500">派工資料會自動從「案件管理」連動</div>
          </div>
        ) : (
          jobs.map((j) => (
            <div key={j.id} className="bg-white border border-stone-200 rounded-xl p-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="font-black text-lg">{j.cases?.customer_name || '未知客戶'}</div>
                  <div className="text-sm text-stone-500">📅 {j.job_date}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-bold ${
                  j.status === 'working' ? 'bg-green-100 text-green-700' :
                  j.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {j.status === 'working' ? '進行中' : j.status === 'completed' ? '已完成' : '已派工'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
