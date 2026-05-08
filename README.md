# 強悍割草班 完整管理系統

完整的前台官網 + 後台管理系統，使用 Next.js + Supabase。

## 🌟 系統包含

### 前台網站 (公開)
- ✅ 響應式官網介紹
- ✅ 服務項目展示
- ✅ 服務地區介紹
- ✅ 線上預約表單(自動進後台)

### 工人手機介面 (`/worker`)
- ✅ 點選名字進入打卡
- ✅ 上工/收工按鈕
- ✅ GPS 自動定位
- ✅ 即時計算今日工時
- ✅ 本月累積工時/天數/薪資

### 老闆後台 (`/admin`)
9 個分頁：
- 📊 儀表板 (今日打卡、營收、工時排行)
- 📁 案件管理 (報價→施工→完工→收款)
- 👥 工人管理 (8 人團隊狀態)
- 📋 工時報表 (匯出 Excel)
- 💼 派工管理
- 📞 客戶資料庫 (搜尋、分級)
- 📅 客戶預約 (一鍵回電)
- 💰 財務記帳 (收入/支出/淨利)
- 🚚 車輛管理

---

## 🚀 部署到 Vercel (免費)

### 步驟 1：上傳到 GitHub

```bash
# 在電腦終端機執行 (在這個資料夾下)
cd qianghan-app

git init
git add .
git commit -m "初版完成"

# 在 GitHub 建一個新 repo (例如 qianghan-app)
# 然後執行:
git remote add origin https://github.com/你的帳號/qianghan-app.git
git branch -M main
git push -u origin main
```

### 步驟 2：部署到 Vercel

1. 到 [vercel.com](https://vercel.com) 用 GitHub 登入
2. 點 **"Import Project"**
3. 選擇剛上傳的 `qianghan-app` repo
4. **重要：設定環境變數**：

```
NEXT_PUBLIC_SUPABASE_URL=https://lyrkjozzlvhtsrbfpscv.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_18MFNBlmQ-KSAmSGQ31jpA_t6UUW4i4
```

5. 點 **"Deploy"**
6. 等 1-2 分鐘 → **完成！** 🎉

你會拿到 3 個網址：

```
🌐 前台:        https://你的專案名.vercel.app
📱 工人打卡:    https://你的專案名.vercel.app/worker
💻 老闆後台:    https://你的專案名.vercel.app/admin
```

---

## 📱 工人怎麼用

1. 工人手機開啟：`https://你的網址/worker`
2. 點「**加到主畫面**」(瀏覽器選單 → 加到主螢幕)
3. 桌面就會出現 App 圖示
4. 之後點圖示 → 選名字 → 上工/收工
5. **完全不用記帳號密碼！**

---

## 💻 老闆怎麼用

1. 電腦/手機開啟：`https://你的網址/admin`
2. 看儀表板了解今日狀況
3. 點選不同分頁管理：
   - 客戶預約來了 → 點「立即回電」
   - 接到案件 → 案件管理 → 新增
   - 案件完工 → 案件管理 → 標記已收款
   - 加油了 → 財務記帳 → 新增支出
   - 月底 → 工時報表 → 匯出 Excel

---

## 🛠 本機開發 (可選)

```bash
npm install
npm run dev
```

打開 [http://localhost:3000](http://localhost:3000)

---

## 🎯 之後可以加的功能

- LINE Login (工人用 LINE 登入)
- LINE Notify (新預約自動通知)
- 拍照上傳 (案件前後對比照)
- 客戶簽收電子簽名
- 員工請假申請

---

## 📞 系統支援

如有問題請聯絡 Claude 繼續優化！
