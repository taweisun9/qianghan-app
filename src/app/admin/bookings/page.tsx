'use client';

import { useEffect, useState } from 'react';
import { getBookings, updateBookingStatus } from '@/lib/supabase';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => getBookings().then(setBookings);

  const updateStatus = async (id: number, status: string) => {
    await updateBookingStatus(id, status);
    refresh();
  };

  const sorted = [...bookings].sort((a, b) => {
    const order = { new: 0, contacted: 1, confirmed: 2, cancelled: 3 };
    return (order[a.status as keyof typeof order] || 9) - (order[b.status as keyof typeof order] || 9);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black">客戶預約</h1>
        <div className="text-sm text-stone-500">從前台網站、Facebook、LINE 來的詢問</div>
      </div>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="bg-white p-12 text-center text-stone-400 rounded-xl">目前沒有預約</div>
        ) : (
          sorted.map((b) => (
            <div key={b.id} className="bg-white border border-stone-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center font-black">{b.customer_name[0]}</div>
                  <div>
                    <div className="font-black text-lg">{b.customer_name}</div>
                    <div className="text-sm text-stone-500">{b.phone} · {b.area || '-'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {b.status === 'new' && <span className="bg-red-700 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">🔴 新預約</span>}
                  {b.status === 'contacted' && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded font-bold">📞 已聯絡</span>}
                  {b.status === 'confirmed' && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">✅ 已確認</span>}
                  {b.status === 'cancelled' && <span className="bg-stone-200 text-stone-600 text-xs px-2 py-1 rounded font-bold">❌ 取消</span>}
                  <span className="text-xs text-stone-400">{new Date(b.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="bg-stone-50 rounded p-3 mb-3 text-sm">
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-bold mr-2">{b.service_type}</span>
                {b.description || '(無備註)'}
              </div>
              <div className="flex gap-2 flex-wrap">
                <a href={`tel:${b.phone}`} className="flex-1 bg-red-700 text-white py-2 rounded font-bold text-sm text-center min-w-[120px]">📞 立即回電</a>
                {b.status === 'new' && <button onClick={() => updateStatus(b.id, 'contacted')} className="flex-1 border-2 border-stone-300 py-2 rounded font-bold text-sm min-w-[120px]">標記已聯絡</button>}
                {b.status === 'contacted' && <button onClick={() => updateStatus(b.id, 'confirmed')} className="flex-1 border-2 border-green-500 text-green-700 py-2 rounded font-bold text-sm min-w-[120px]">標記已確認</button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
