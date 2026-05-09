'use client';

import { useState } from 'react';
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
    <div style={{ minHeight: '100vh', backgroundColor: '#fafaf9' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'white', borderBottom: '2px solid #1c1917', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#b91c1c', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '20px' }}>悍</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '0.1em' }}>強悍割草班</div>
              <div style={{ fontSize: '12px', color: '#78716c' }}>QIANG HAN | TAITUNG</div>
            </div>
          </div>
          <a href="tel:0906505690" style={{ backgroundColor: '#b91c1c', color: 'white', padding: '8px 16px', borderRadius: '4px', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>📞 0906-505690</a>
        </div>
      </header>

      <section style={{ position: 'relative', color: 'white', overflow: 'hidden', backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%), url(/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '600px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '80px 24px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '0.4em', marginBottom: '24px', opacity: 0.8 }}>EST. TAITUNG TAIWAN</div>
          <h1 style={{ fontSize: '72px', fontWeight: 900, lineHeight: 1, marginBottom: '24px' }}>
            再硬的草<br/>
            <span style={{ color: '#fde047' }}>交給強悍</span>
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '32px', opacity: 0.95, maxWidth: '672px' }}>台東在地 8 人專業團隊。割草・整地・鋸樹・工程承攬。</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a href="tel:0906505690" style={{ backgroundColor: '#fde047', color: '#1c1917', padding: '16px 32px', borderRadius: '4px', fontWeight: 900, fontSize: '18px', textDecoration: 'none' }}>
              📞 立即來電 0906-505690
            </a>
            <button onClick={() => setShowBooking(true)} style={{ border: '2px solid white', color: 'white', backgroundColor: 'transparent', padding: '16px 32px', borderRadius: '4px', fontWeight: 900, fontSize: '18px', cursor: 'pointer' }}>
              💬 線上預約 →
            </button>
          </div>
          <div style={{ display: 'flex', gap: '24px', marginTop: '48px', flexWrap: 'wrap', fontSize: '14px' }}>
            <div>✓ 現場免費估價</div>
            <div>✓ 價格公道透明</div>
            <div>✓ 做工確實負責</div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1152px', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '12px', letterSpacing: '0.4em', color: '#b91c1c', marginBottom: '12px', fontWeight: 700 }}>SERVICES</div>
          <h2 style={{ fontSize: '36px', fontWeight: 900 }}>服務項目</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ border: '2px solid #1c1917', overflow: 'hidden', backgroundColor: 'white' }}>
            <div style={{ height: '192px', backgroundImage: 'linear-gradient(to top, rgba(28,25,23,0.6), transparent), url(/service-grass.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontWeight: 900, fontSize: '20px', marginBottom: '4px' }}>🌿 割草清理</div>
              <div style={{ fontSize: '14px', color: '#57534e' }}>住家、農地、果園、空地一律承接</div>
            </div>
          </div>
          <div style={{ border: '2px solid #1c1917', overflow: 'hidden', backgroundColor: 'white' }}>
            <div style={{ height: '192px', backgroundImage: 'linear-gradient(to top, rgba(28,25,23,0.6), transparent), url(/service-land.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontWeight: 900, fontSize: '20px', marginBottom: '4px' }}>🚜 土地整地</div>
              <div style={{ fontSize: '14px', color: '#57534e' }}>雜物清除、地面平整、土地復原</div>
            </div>
          </div>
          <div style={{ border: '2px solid #1c1917', overflow: 'hidden', backgroundColor: 'white' }}>
            <div style={{ height: '192px', backgroundImage: 'linear-gradient(to top, rgba(28,25,23,0.6), transparent), url(/service-tree.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontWeight: 900, fontSize: '20px', marginBottom: '4px' }}>🌳 樹木鋸除</div>
              <div style={{ fontSize: '14px', color: '#57534e' }}>修枝、伐木、危木處理</div>
            </div>
          </div>
          <div style={{ border: '2px solid #1c1917', overflow: 'hidden', backgroundColor: 'white' }}>
            <div style={{ height: '192px', backgroundImage: 'linear-gradient(to top, rgba(28,25,23,0.6), transparent), url(/service-work.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            <div style={{ padding: '20px' }}>
              <div style={{ fontWeight: 900, fontSize: '20px', marginBottom: '4px' }}>💼 工程承攬</div>
              <div style={{ fontSize: '14px', color: '#57534e' }}>工地、農場、廠商人力配合</div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#f5f5f4', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.4em', color: '#b91c1c', marginBottom: '12px', fontWeight: 700 }}>OUR TEAM</div>
            <h2 style={{ fontSize: '36px', fontWeight: 900 }}>我們的團隊</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div style={{ position: 'relative', height: '384px', overflow: 'hidden', borderRadius: '12px', backgroundImage: 'linear-gradient(to top, rgba(28,25,23,0.9), rgba(28,25,23,0.3), transparent), url(/team.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', color: 'white' }}>
                <div style={{ fontSize: '12px', letterSpacing: '0.2em', opacity: 0.8, marginBottom: '8px' }}>8 PERSON CREW</div>
                <div style={{ fontWeight: 900, fontSize: '30px', marginBottom: '4px' }}>強悍 8 人團隊</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>在地經驗豐富,使命必達</div>
              </div>
            </div>
            <div style={{ position: 'relative', height: '384px', overflow: 'hidden', borderRadius: '12px', backgroundImage: 'linear-gradient(to top, rgba(28,25,23,0.9), rgba(28,25,23,0.3), transparent), url(/tools.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', color: 'white' }}>
                <div style={{ fontSize: '12px', letterSpacing: '0.2em', opacity: 0.8, marginBottom: '8px' }}>PROFESSIONAL EQUIPMENT</div>
                <div style={{ fontWeight: 900, fontSize: '30px', marginBottom: '4px' }}>專業設備</div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>背負式割草機、鏈鋸、卡車</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#1c1917', color: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={{ fontSize: '12px', letterSpacing: '0.4em', color: '#fde047', marginBottom: '12px', fontWeight: 700 }}>SERVICE AREAS</div>
            <h2 style={{ fontSize: '36px', fontWeight: 900 }}>服務地區・台東縣</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {AREAS.map((a) => (
              <div key={a} style={{ border: '1px solid #44403c', padding: '16px', textAlign: 'center', cursor: 'pointer' }}>📍 {a}</div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: '#7f1d1d', color: 'white', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '768px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '48px', fontWeight: 900, marginBottom: '24px' }}>需要我們的服務嗎?</h2>
          <p style={{ fontSize: '18px', marginBottom: '32px', opacity: 0.95 }}>免費到場估價,馬上回覆!</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:0906505690" style={{ backgroundColor: '#fde047', color: '#1c1917', padding: '16px 32px', borderRadius: '4px', fontWeight: 900, fontSize: '18px', textDecoration: 'none' }}>
              📞 0906-505690
            </a>
            <button onClick={() => setShowBooking(true)} style={{ border: '2px solid white', color: 'white', backgroundColor: 'transparent', padding: '16px 32px', borderRadius: '4px', fontWeight: 900, fontSize: '18px', cursor: 'pointer' }}>
              💬 線上預約
            </button>
          </div>
          <div style={{ fontSize: '14px', marginTop: '32px', opacity: 0.8 }}>劉加明 ・ 週一至週六 07:00 - 18:00</div>
        </div>
      </section>

      <footer style={{ backgroundColor: '#1c1917', color: 'white', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{ fontWeight: 900, fontSize: '24px', marginBottom: '8px' }}>強悍割草班</div>
          <div style={{ fontSize: '14px', opacity: 0.6 }}>台東在地 8 人專業團隊</div>
          <div style={{ fontSize: '12px', opacity: 0.4, marginTop: '16px' }}>© 2026 強悍割草班. All rights reserved.</div>
        </div>
      </footer>

      {showBooking && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowBooking(false)}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', maxWidth: '448px', width: '100%', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>預約成功!</h3>
                <p style={{ color: '#57534e' }}>我們會盡快回電給您 🙏</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '4px' }}>線上預約</h3>
                <p style={{ fontSize: '14px', color: '#78716c', marginBottom: '20px' }}>填寫資料,我們會盡快回電</p>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>姓名 *</label>
                    <input required type="text" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d6d3d1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} placeholder="陳先生 / 林小姐" />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>電話 *</label>
                    <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d6d3d1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }} placeholder="0912-345-678" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>地區</label>
                      <select value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d6d3d1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }}>
                        {AREAS.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>服務</label>
                      <select value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d6d3d1', borderRadius: '4px', outline: 'none', boxSizing: 'border-box' }}>
                        <option>割草</option><option>整地</option><option>鋸樹</option><option>工程承攬</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>需求說明</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ width: '100%', padding: '8px 12px', border: '1px solid #d6d3d1', borderRadius: '4px', outline: 'none', height: '80px', boxSizing: 'border-box' }} placeholder="例:果園大概 3 分地需要清理" />
                  </div>
                  <button type="submit" disabled={submitting} style={{ width: '100%', backgroundColor: '#b91c1c', color: 'white', padding: '12px', borderRadius: '4px', fontWeight: 900, border: 'none', cursor: 'pointer', opacity: submitting ? 0.5 : 1 }}>
                    {submitting ? '送出中...' : '✉ 送出預約'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
