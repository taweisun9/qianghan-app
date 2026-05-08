'use client';

import { useState, useEffect } from 'react';
import { Bell, MapPin, CheckCircle2, Camera, Fuel, Calendar, LogOut } from 'lucide-react';
import { getWorkers, clockIn, clockOut, getTodayClockRecords, getMonthClockRecords } from '@/lib/supabase';

export default function WorkerPage() {
  const [workers, setWorkers] = useState<any[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [todayRecords, setTodayRecords] = useState<any[]>([]);
  const [monthRecords, setMonthRecords] = useState<any[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('正在取得位置...');
  const [coords, setCoords] = useState<{ lat?: number; lng?: number }>({});

  // 載入工人
  useEffect(() => {
    getWorkers().then(setWorkers);
  }, []);

  // 取得 GPS
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocation('GPS 已定位');
        },
        () => setLocation('無法取得 GPS'),
        { timeout: 5000 }
      );
    }
  }, []);

  // 載入打卡記錄
  useEffect(() => {
    if (selectedWorker) {
      getTodayClockRecords(selectedWorker.id).then(setTodayRecords);
      getMonthClockRecords(selectedWorker.id).then(setMonthRecords);
    }
  }, [selectedWorker]);

  // 判斷狀態
  const lastRecord = todayRecords[0];
  const isClockedIn = lastRecord?.type === 'clock_in';

  // 計算今日工時
  const calcTodayHours = () => {
    if (!isClockedIn || !lastRecord) return 0;
    const clockInTime = new Date(lastRecord.clock_time).getTime();
    const now = Date.now();
    return ((now - clockInTime) / 1000 / 3600).toFixed(1);
  };

  // 計算本月工時/天數/薪資
  const calcMonth = () => {
    let totalHours = 0;
    const days = new Set<string>();
    const pairs: Record<string, { in?: any; out?: any }> = {};

    monthRecords.forEach((r) => {
      const day = r.clock_time.split('T')[0];
      days.add(day);
      if (!pairs[day]) pairs[day] = {};
      if (r.type === 'clock_in') pairs[day].in = r;
      if (r.type === 'clock_out') pairs[day].out = r;
    });

    Object.values(pairs).forEach((p) => {
      if (p.in && p.out) {
        totalHours += (new Date(p.out.clock_time).getTime() - new Date(p.in.clock_time).getTime()) / 1000 / 3600;
      }
    });

    const salary = Math.round(totalHours * (selectedWorker?.hourly_rate || 200));
    return { days: days.size, hours: totalHours.toFixed(0), salary };
  };

  const handleClock = async (type: 'in' | 'out') => {
    if (!selectedWorker) return;
    setLoading(true);
    try {
      if (type === 'in') {
        await clockIn(selectedWorker.id, location, coords.lat, coords.lng);
      } else {
        await clockOut(selectedWorker.id, location, coords.lat, coords.lng);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      // 重新載入
      const today = await getTodayClockRecords(selectedWorker.id);
      const month = await getMonthClockRecords(selectedWorker.id);
      setTodayRecords(today);
      setMonthRecords(month);
    } catch (err) {
      alert('打卡失敗,請再試一次');
    }
    setLoading(false);
  };

  // === 選擇工人畫面 ===
  if (!selectedWorker) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col">
        <div className="bg-red-700 text-white p-5 text-center">
          <div className="text-2xl font-black tracking-widest">強悍割草班</div>
          <div className="text-xs opacity-80 tracking-wider mt-1">員工打卡系統</div>
        </div>
        <div className="flex-1 p-5 max-w-md mx-auto w-full">
          <div className="text-center mb-6">
            <div className="text-lg font-black mb-1">請選擇你的名字</div>
            <div className="text-sm text-stone-500">點下你的名字進入打卡</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {workers.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWorker(w)}
                className="bg-white border-2 border-stone-200 hover:border-red-700 rounded-xl p-5 text-center transition active:scale-95"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-red-700 to-red-900 rounded-full flex items-center justify-center text-white font-black text-2xl mx-auto mb-2">
                  {w.name[w.name.length - 1]}
                </div>
                <div className="font-black text-lg">{w.name}</div>
                <div className="text-xs text-stone-500">工號 {w.worker_code}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const todayHours = calcTodayHours();
  const monthData = calcMonth();

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl">
        {/* Header */}
        <div className="bg-red-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-red-700 rounded-full flex items-center justify-center font-black">
              {selectedWorker.name[selectedWorker.name.length - 1]}
            </div>
            <div>
              <div className="font-bold">{selectedWorker.name}</div>
              <div className="text-xs opacity-80">工號 {selectedWorker.worker_code}</div>
            </div>
          </div>
          <button onClick={() => setSelectedWorker(null)} className="text-sm opacity-70 hover:opacity-100">
            <LogOut size={18} />
          </button>
        </div>

        <div className="p-5">
          {/* 今日狀態 */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white rounded-2xl p-6 mb-5">
            <div className="text-xs opacity-60 mb-1">
              今天 · {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })}
            </div>
            <div className="text-4xl font-black mb-4">
              {isClockedIn ? '工作中' : '尚未上工'}
            </div>
            {isClockedIn && lastRecord && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-t border-stone-700 pt-3">
                  <span className="opacity-60">上工時間</span>
                  <span className="font-bold">{new Date(lastRecord.clock_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">已工作</span>
                  <span className="font-bold text-yellow-300">{todayHours} 小時</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">位置</span>
                  <span className="font-bold">📍 {lastRecord.location || '-'}</span>
                </div>
              </div>
            )}
          </div>

          {/* 打卡按鈕 */}
          {!isClockedIn ? (
            <button
              onClick={() => handleClock('in')}
              disabled={loading}
              className="w-full bg-green-600 text-white py-6 rounded-2xl font-black text-2xl shadow-lg hover:bg-green-700 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? '打卡中...' : '🌿 上工打卡'}
            </button>
          ) : (
            <button
              onClick={() => handleClock('out')}
              disabled={loading}
              className="w-full bg-red-700 text-white py-6 rounded-2xl font-black text-2xl shadow-lg hover:bg-red-800 active:scale-95 transition disabled:opacity-50"
            >
              {loading ? '打卡中...' : '🏁 收工打卡'}
            </button>
          )}

          {/* GPS 資訊 */}
          <div className="mt-4 bg-stone-50 rounded-xl p-4 text-sm">
            <div className="flex items-center gap-2 text-stone-600">
              <MapPin size={16} className="text-red-700" />
              {location}
              {coords.lat && (
                <span className="text-xs opacity-60 ml-1">
                  ({coords.lat.toFixed(3)}, {coords.lng?.toFixed(3)})
                </span>
              )}
            </div>
          </div>

          {/* 本月累積 */}
          <div className="mt-5 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-5">
            <div className="text-xs text-yellow-800 font-bold mb-1 tracking-widest">本月累積</div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <div className="text-3xl font-black text-stone-900">{monthData.days}</div>
                <div className="text-xs text-stone-600">天</div>
              </div>
              <div>
                <div className="text-3xl font-black text-stone-900">{monthData.hours}</div>
                <div className="text-xs text-stone-600">小時</div>
              </div>
              <div>
                <div className="text-3xl font-black text-red-700">{monthData.salary.toLocaleString()}</div>
                <div className="text-xs text-stone-600">預估薪資</div>
              </div>
            </div>
          </div>

          {/* 今日打卡紀錄 */}
          {todayRecords.length > 0 && (
            <div className="mt-5">
              <div className="text-sm font-bold mb-3">今日打卡紀錄</div>
              <div className="space-y-2">
                {todayRecords.map((r) => (
                  <div key={r.id} className="flex items-center justify-between bg-stone-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        r.type === 'clock_in' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {r.type === 'clock_in' ? '上工' : '收工'}
                      </span>
                      <span className="text-sm text-stone-600">📍 {r.location || '-'}</span>
                    </div>
                    <div className="font-bold text-sm">
                      {new Date(r.clock_time).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 成功提示 */}
      {showSuccess && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-8 py-6 rounded-2xl shadow-2xl z-50">
          <CheckCircle2 size={48} className="mx-auto mb-2" />
          <div className="text-xl font-black">打卡成功!</div>
        </div>
      )}
    </div>
  );
}
