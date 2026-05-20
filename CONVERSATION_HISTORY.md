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

## 維護說明

- 每完成一個階段，同步更新 `DEVELOPMENT_LOG.md`（進度）與本文件（對話重點）
- 更新後執行 `git add . && git commit && git push` 推回 GitHub
