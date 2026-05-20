# 喜財快餐專案 — 歷代對話重點與技術備忘錄

本文件彙整歷次 AI 協作對話的重點決策、技術選型理由、遇到的困難與解決方案，作為長期維護的技術備忘錄。

---

## 第 1 輪對話（2026-05-20）｜專案初始化 & 多語系架構

### 重點決策

| 決策 | 選擇 | 理由 |
|------|------|------|
| 框架 | Next.js App Router + TypeScript | 支援 SSR、路由結構清晰、生態完整 |
| i18n 方案 | `next-intl` | 與 App Router 整合最佳、支援 Server Component |
| 語系數量 | 5 種（zh/th/vi/my/km） | 符合樹林柑園工業區外籍員工實際比例 |
| 雙端設計 | 網頁版 + A4 實體傳單 | 工廠環境部分員工無手機/網路，紙本更實用 |

### 遇到的困難與解決方案

**問題 1：Next.js App Router 與 next-intl 路由衝突**
- 症狀：語系參數解析失敗或 404
- 解法：使用 `defineRouting` + `createNavigation`，在 `src/middleware.ts` 攔截路由

**問題 2：`params` 異步類型警告（Next.js 新版）**
- 症狀：直接用 `params.locale` 觸發編譯錯誤
- 解法：頁面組件改為 `async function`，用 `const { locale } = await params;` 解構

**問題 3：緬甸文 / 高棉文 字型缺字（豆腐塊）**
- 症狀：部分 Windows/Mac 顯示空白方格
- 解法：font-family 加入 `Segoe UI Historic`, `Tahoma`, `Noto Sans Myanmar`, `Noto Sans Khmer` 備用字型

**問題 4：東南亞語系詞彙過長導致 A4 傳單溢出**
- 症狀：泰/越/緬/高棉文比中文長 2~3 倍，撐爆卡片/溢出 A4
- 解法：全面使用 `flex-direction: column` + `overflow: hidden` + 精確 `height` 控制

### 成果
- 網頁版：5 語言動態切換，橘黃色調自適應網格，10 主食 + 4 湯品 + 4 小菜
- A4 傳單：`public/flyer.html`，6 熱銷便當 5 語並列，含一鍵列印與 QR Code

---

## 第 2 輪對話（2026-05-20）｜GitHub 建倉、Vercel 部署、圖片整合

### 重點決策

| 決策 | 選擇 | 理由 |
|------|------|------|
| GitHub repo 命名 | `xi-cai-bento-shop` | 英文音譯，利於辨識 |
| 圖片優先順序 | 中文命名實拍 > 舊 AI 圖 | 真實照片品質更佳，AI 圖保留備援 |
| Vercel 部署方式 | REST API (`v13/deployments`) | CLI 有 Node 18 引擎不相容問題 |
| 自動同步機制 | Claude Stop hook | 對話結束自動 git push，不需手動操作 |

### 遇到的困難與解決方案

**問題 1：Vercel CLI 與 Node.js 18 不相容**
- 症狀：`vercel@54` 安裝時出現 `EBADENGINE`；`vercel@47` 安裝成功但 API endpoint 要求 47.2.2+；`vercel@32` 可安裝但需要登入
- 解法：完全繞過 CLI，改用 Vercel REST API `POST /v13/deployments`，帶入 `gitSource`（repoId + sha + ref）直接觸發 Production 部署

**問題 2：Vercel 專案未連結 GitHub**
- 症狀：`PATCH /v9/projects` 嘗試更新 `link` 欄位時回傳 `bad_request`（API 不支援此欄位）
- 解法：跳過連結步驟，直接在 deployment API 中指定 `gitSource` 帶入 GitHub repo 資訊，Vercel 自動處理 clone 與 build

**問題 3：圖片對應關係不明確**
- 症狀：使用者以中文命名新圖片，不確定哪些 AI 圖已被替換
- 解法：用 `git show <commit>:src/app/[locale]/page.tsx` 還原原始映射關係，逐一對比確認哪 5 張已更新、哪 5 張仍為 AI 圖

### 本輪成果
- GitHub repo 上線：`FAUST-777/xi-cai-bento-shop`
- 網站首頁連結更新：`https://bento-shop.vercel.app/zh`
- 5 張實拍照片正確對應到 page.tsx（id 2~6）
- Vercel Production 部署成功，網站已更新
- `.claude/settings.json` 加入 Stop hook 自動同步

### 待辦
- id 1、7、8、9、10 的實拍或 AI 生成圖片（可參考現有照片風格，用 ChatGPT GPT-4o 或 Midjourney 生成）

---

## 維護說明

- 每完成一個階段，同步更新 `DEVELOPMENT_LOG.md`（進度）與本文件（對話重點）
- 更新後執行 `git add . && git commit && git push` 推回 GitHub
