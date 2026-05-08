'use client';

import { useState } from 'react';
import { Phone, CheckCircle2, Sprout, Truck, Trees, Briefcase, MapPin, Send } from 'lucide-react';
import { createBooking } from '@/lib/supabase';

const SERVICES = [
  { icon: Sprout, title: '割草清理', desc: '住家、農地、果園、空地一律承接', img: '/service-grass..jpg' },
  { icon: Truck, title: '土地整地', desc: '雜物清除、地面平整、土地復原', img: '/service-land.jpg' },
  { icon: Trees, title: '樹木鋸除', desc: '修枝、伐木、危木處理', img: '/service-tree.jpg' },
  { icon: Briefcase, title: '工程承攬', desc: '工地、農場、廠商人力配合', img: '/service-work.jpg' },
];

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
    <div className="min-h-screen bg-stone-50 font-serif">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b-2 border-stone-900 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-700 rounded flex items-center justify-center text-white font-black text-xl">悍</div>
            <div>
              <div className="font-black text-xl tracking-widest">強悍割草班</div>
              <div className="text-xs text-stone-500 tracking-wider">QIANG HAN | TAITUNG</div>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-bold">
            <a href="#services" className="hover:text-red-700">服務</a>
            <a href="#gallery" className="hover:text-red-700">作品</a>
            <a href="#areas" className="hover:text-red-700">地區</a>
            <a href="#contact" className="hover:text-red-700">聯絡</a>
          </nav>
          <a href="tel:0906505690" className="bg-red-700 text-white px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-red-800">
            <Phone size={14} /> <span className="hidden sm:inline">0906-505690</span><span className="sm:hidden">電話</span>
          </a>
        </div>
      </header>

      {/* Hero with background image */}
      <section className="relative text-white overflow-hidden">
        {/* 背景圖 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero..jpg')" }}
        />
        {/* 紅色半透明遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/85 via-red-800/80 to-red-900/85" />
        {/* 條紋紋路 */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
        }} />

        <div className="max-w-6xl mx-auto px-6 py-20 md:py-32 relative">
          <div className="text-xs tracking-[0.4em] mb-6 opacity-80">EST. TAITUNG TAIWAN</div>
          <h1 className="text-5xl md:text-8xl font-black leading-none mb-6 tracking-tight drop-shadow-2xl">
            再硬的草<br/>
            <span className="text-yellow-300">交給強悍</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-95 max-w-2xl drop-shadow-lg">台東在地 8 人專業團隊。割草・整地・鋸樹・工程承攬。從一片庭院到整座山坡,做到客戶滿意為止。</p>
          <div className="flex gap-3 flex-wrap">
            <a href="tel:0906505690" className="bg-yellow-300 text-stone-900 px-6 md:px-8 py-4 rounded font-black text-base md:text-lg hover:bg-yellow-200 shadow-2xl">
              📞 立即來電 0906-505690
            </a>
            <button
              onClick={() => setShowBooking(true)}
              className="border-2 border-white px-6 md:px-8 py-4 rounded font-black text-base md:text-lg hover:bg-white hover:text-red-700 backdrop-blur-sm bg-white/10"
            >
              💬 線上預約 →
            </button>
          </div>
          <div className="flex gap-6 md:gap-8 mt-12 flex-wrap text-sm">
            <div className="flex items-center gap-2"><CheckCircle2 size={20} className="text-yellow-300" /> 現場免費估價</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={20} className="text-yellow-300" /> 價格公道透明</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={20} className="text-yellow-300" /> 做工確實負責</div>
          </div>
        </div>
      </section>

      {/* Services with images */}
      <section id="services" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="text-center mb-12">
          <div className="text-xs tracking-[0.4em] text-red-700 mb-3 font-bold">SERVICES</div>
          <h2 className="text-3xl md:text-4xl font-black">服務項目</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {SERVICES.map((s, i) => (
            <div key={i} className="border-2 border-stone-900 overflow-hidden hover:shadow-2xl transition group cursor-pointer">
              {/* 圖片區 */}
              <div className="relative h-40 md:h-48 overflow-hidden bg-stone-200">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition duration-500"
                  style={{ backgroundImage: `url('${s.img}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                <s.icon size={32} className="absolute top-3 right-3 text-yellow-300 drop-shadow-lg" />
              </div>
              {/* 文字區 */}
              <div className="p-4 md:p-5 bg-white group-hover:bg-stone-900 group-hover:text-white transition">
                <div className="font-black text-lg md:text-xl mb-1">{s.title}</div>
                <div className="text-xs md:text-sm text-stone-600 group-hover:text-stone-300">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery (作品集) - 用 team.jpg 和 tools.jpg */}
      <section id="gallery" className="bg-stone-100 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.4em] text-red-700 mb-3 font-bold">GALLERY</div>
            <h2 className="text-3xl md:text-4xl font-black">我們的團隊</h2>
            <p className="text-stone-500 mt-3">8 人專業團隊・專業工具設備</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* 團隊 */}
            <div className="relative h-72 md:h-96 overflow-hidden rounded-xl group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-700"
                style={{ backgroundImage: "url('/team.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-xs tracking-widest opacity-80 mb-2">OUR TEAM</div>
                <div className="font-black text-2xl md:text-3xl mb-1">強悍 8 人團隊</div>
                <div className="text-sm opacity-90">在地經驗豐富,使命必達</div>
              </div>
            </div>
            {/* 工具 */}
            <div className="relative h-72 md:h-96 overflow-hidden rounded-xl group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition duration-700"
                style={{ backgroundImage: "url('/tools.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="text-xs tracking-widest opacity-80 mb-2">EQUIPMENT</div>
                <div className="font-black text-2xl md:text-3xl mb-1">專業設備</div>
                <div className="text-sm opacity-90">背負式割草機、鏈鋸、卡車</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.4em] text-red-700 mb-3 font-bold">WHY US</div>
            <h2 className="text-3xl md:text-4xl font-black">為什麼選擇強悍</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '01', title: '在地多年經驗', desc: '熟悉台東地形與氣候' },
              { num: '02', title: '8 人專業團隊', desc: '人力充足機動性高' },
              { num: '03', title: '設備齊全', desc: '專業背負式割草機、鏈鋸' },
              { num: '04', title: '價格透明', desc: '事先估價絕不亂喊' },
            ].map((w, i) => (
              <div key={i} className="bg-stone-50 p-5 md:p-6 rounded text-center hover:shadow-lg transition">
                <div className="text-3xl md:text-4xl font-black text-red-700 opacity-30 mb-2">{w.num}</div>
                <div className="font-black text-base md:text-lg mb-1">{w.title}</div>
                <div className="text-xs md:text-sm text-stone-500">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section id="areas" className="bg-stone-900 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.4em] text-yellow-300 mb-3 font-bold">SERVICE AREAS</div>
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

      {/* Contact / CTA with share image as background */}
      <section id="contact" className="relative text-white py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/share.jpg')" }}
        />
        <div className="absolute inset-0 bg-red-900/85" />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl md:text-5xl font-black mb-6 drop-shadow-2xl">需要我們的服務嗎?</h2>
          <p className="text-lg mb-8 opacity-95">免費到場估價,馬上回覆!</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a href="tel:0906505690" className="bg-yellow-300 text-stone-900 px-8 py-4 rounded font-black text-lg hover:bg-yellow-200 inline-flex items-center gap-2 shadow-2xl">
              <Phone size={20} /> 0906-505690
            </a>
            <button
              onClick={() => setShowBooking(true)}
              className="border-2 border-white px-8 py-4 rounded font-black text-lg hover:bg-white hover:text-red-700 backdrop-blur-sm bg-white/10"
            >
              💬 線上預約
            </button>
          </div>
          <div className="text-sm mt-8 opacity-80">劉加明 ・ 週一至週六 07:00 - 18:00</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="font-black text-2xl mb-2">強悍割草班</div>
          <div className="text-sm opacity-60">台東在地 8 人專業團隊</div>
          <div className="text-xs opacity-40 mt-4">© 2026 強悍割草班. All rights reserved.</div>
        </div>
      </footer>

      {/* 預約彈窗 */}
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
                    <input
                      required
                      type="text"
                      value={form.customer_name}
                      onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-red-700 outline-none"
                      placeholder="陳先生 / 林小姐"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">電話 *</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded focus:border-red-700 outline-none"
                      placeholder="0912-345-678"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold mb-1">地區</label>
                      <select
                        value={form.area}
                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded outline-none"
                      >
                        {AREAS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-1">服務</label>
                      <select
                        value={form.service_type}
                        onChange={(e) => setForm({ ...form, service_type: e.target.value })}
                        className="w-full px-3 py-2 border border-stone-300 rounded outline-none"
                      >
                        <option>割草</option>
                        <option>整地</option>
                        <option>鋸樹</option>
                        <option>工程承攬</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-1">需求說明</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 border border-stone-300 rounded outline-none h-20"
                      placeholder="例:果園大概 3 分地需要清理"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-red-700 text-white py-3 rounded font-black hover:bg-red-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? '送出中...' : <><Send size={18} /> 送出預約</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* 浮動電話按鈕 */}
      <a href="tel:0906505690" className="md:hidden fixed bottom-4 right-4 bg-red-700 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-30">
        <Phone size={24} />
      </a>
    </div>
  );
}
