'use client';

import { useState } from 'react';
import { Phone, CheckCircle2, MapPin, Send } from 'lucide-react';
import { createBooking } from '@/lib/supabase';

const AREAS = ['台東市', '卑南鄉', '太麻里鄉', '東河鄉', '成功鎮', '關山鎮', '池上鄉', '鹿野鄉'];

export default function HomePage() {
  const [showBooking, setShowBooking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    area: '台東市',
    service_type: '割草',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createBooking({ ...form, source: 'website', status: 'new' });
      setSuccess(true);
      setForm({ customer_name: '', phone: '', area: '台東市', service_type: '割草', description: '' });
      setTimeout(() => {
        setShowBooking(false);
        setSuccess(false);
      }, 2500);
    } catch (err) {
      alert('送出失敗,請直接電話聯絡!');
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-40 bg-white border-b-2 border-stone-900 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700 rounded flex items-center justify-center text-white font-black text-xl">悍</div>
            <div>
              <div className="font-black text-xl tracking-widest">強悍割草班</div>
              <div className="text-xs text-stone-500 tracking-wider">QIANG HAN | TAITUNG</div>
            </div>
          </div>
          <a href="tel:0906505690" className="bg-red-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-red-800">
            <Phone size={14} /> <span className="hidden sm:inline">0906-505690</span><span className="sm:hidden">電話</span>
          </a>
        </div>
      </header>

      <section className="bg-gradient-to-br from-red-800 via-red-700 to-red-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32">
          <div className="text-xs tracking-widest mb-6 opacity-80">EST. TAITUNG TAIWAN</div>
          <h1 className="text-5xl md:text-8xl font-black leading-none mb-6 tracking-tight">
            再硬的草<br/>
            <span className="text-yellow-300">交給強悍</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl">台東在地 8 人專業團隊。割草・整地・鋸樹・工程承攬。</p>
          <div className="flex gap-3 flex-wrap">
            <a href="tel:0906505690" className="bg-yellow-300 text-stone-900 px-6 md:px-8 py-4 rounded font-black text-base md:text-lg hover:bg-yellow-200">
              📞 立即來電 0906-505690
            </a>
            <button onClick={() => setShowBooking(true)} className="border-2 border-white px-6 md:px-8 py-4 rounded font-black text-base md:text-lg hover:bg-white hover:text-red-700">
              💬 線上預約 →
            </button>
          </div>
          <div className="flex gap-6 mt-12 flex-wrap text-sm">
            <div className="flex items-center gap-2"><CheckCircle2 size={20} className="text-yellow-300" /> 現場免費估價</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={20} className="text-yellow-300" /> 價格公道透明</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={20} className="text-yellow-300" /> 做工確實負責</div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="text-xs tracking-widest text-red-700 mb-3 font-bold">SERVICES</div>
          <h2 className="text-3xl md:text-4xl font-black">服務項目</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="border-2 border-stone-900 p-6 hover:bg-stone-900 hover:text-white transition cursor-pointer">
            <div className="text-3xl mb-3">🌿</div>
            <div className="font-black text-lg mb-2">割草清理</div>
            <div className="text-xs text-stone-600">住家、農地、果園、空地一律承接</div>
          </div>
          <div className="border-2 border-stone-900 p-6 hover:bg-stone-900 hover:text-white transition cursor-pointer">
            <div className="text-3xl mb-3">🚜</div>
            <div className="font-black text-lg mb-2">土地整地</div>
            <div className="text-xs text-stone-600">雜物清除、地面平整、土地復原</div>
          </div>
          <div className="border-2 border-stone-900 p-6 hover:bg-stone-900 hover:text-white transition cursor-pointer">
            <div className="text-3xl mb-3">🌳</div>
            <div className="font-black text-lg mb-2">樹木鋸除</div>
            <div className="text-xs text-stone-600">修枝、伐木、危木處理</div>
          </div>
          <div className="border-2 border-stone-900 p-6 hover:bg-stone-900 hover:text-white transition cursor-pointer">
            <div className="text-3xl mb-3">💼</div>
            <div className="font-black text-lg mb-2">工程承攬</div>
            <div className="text-xs text-stone-600">工地、農場、廠商人力配合</div>
          </div>
        </div>
      </section>

      <section className="bg-stone-900 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs tracking-widest text-yellow-300 mb-3 font-bold">SERVICE AREAS</div>
            <h2 className="text-3xl md:text-4xl font-black">服務地區・台東縣</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AREAS.map((a) => (
              <div key={a} className="border border-stone-700 p-4 text-center hover:border-yellow-300 hover:text-yellow-300 cursor-pointer flex items-center justify-center gap-2">
                <MapPin size={16} /> {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-red-900 text-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">需要我們的服務嗎?</h2>
          <p className="text-lg mb-8 opacity-95">免費到場估價,馬上回覆!</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="tel:0906505690" className="bg-yellow-300 text-stone-900 px-8 py-4 rounded font-black text-lg hover:bg-yellow-200 inline-flex items-center gap-2">
              <Phone size={20} /> 0906-505690
            </a>
            <button onClick={() => setShowBooking(true)} className="border-2 border-white px-8 py-4 rounded font-black text-lg hover:bg-white hover:text-red-700">
              💬 線上預約
            </button>
          </div>
          <div className="text-sm mt-8 opacity-80">劉加明 ・ 週一至週六 07:00 - 18:00</div>
        </div>
      </section>

      <footer className="bg-stone-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="font-black text-2xl mb-2">強悍割草班</div>
          <div className="text-sm opacity-60">台東在地 8 人專業團隊</div>
          <div className="text-xs opacity-40 mt-4">© 2026 強悍割草班. All rights reserved.</div>
        </div>
      </footer>

      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4" onClick={() => setShowBooking(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {success ? (
              <div className="text-center py-8">
                <CheckCircle2 size={64} className="mx-auto text-green-600 mb-4" />
                <h3 className="text-2xl font-black mb-2">預約成功!</h3>
                <p className="text-stone-600">我們會盡快回電給您 🙏</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-black mb-1">線上預約</h3>
                <p className="text-sm text-stone-500 mb-5">填寫資料,我們會盡快回電</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-sm font-bold mb-1">姓名 *</label>
                    <input required type="text" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none" placeholder="陳先生 / 林小姐" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">電話 *</label>
                    <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none" placeholder="0912-345-678" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold mb-1">地區</label>
                      <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none">
                        {AREAS.map(a => <option key={a}>{a}</option>)}
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
                    <label className="block text-sm font-bold mb-1">需求說明</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded outline-none h-20" placeholder="例:果園大概 3 分地需要清理" />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full bg-red-700 text-white py-3 rounded font-black hover:bg-red-800 disabled:opacity-50 flex items-center justify-center gap-2">
                    {submitting ? '送出中...' : <><Send size={18} /> 送出預約</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <a href="tel:0906505690" className="md:hidden fixed bottom-4 right-4 bg-red-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-30">
        <Phone size={24} />
      </a>
    </div>
  );
}
