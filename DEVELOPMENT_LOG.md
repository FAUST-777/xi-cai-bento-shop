# 喜財快餐 (Xi Cai Bento Shop) — 多國語言網站與 A4 傳單專案開發日誌

本專案旨在為位於**樹林區柑園街1段60號-1**的「**喜財快餐**」打造多國語言官方網站與實體 A4 多語對照宣傳單，解決周邊柑園工業區工廠本地與外籍員工（泰國、越南、緬甸、柬埔寨等）的訂餐與溝通痛點。

---

## 📅 專案開發歷程與重大進度

### 階段一：專案啟動與多語系架構建立
*   **技術選型**：採用 **Next.js (App Router)** + **TypeScript**，搭配 **`next-intl`** 實現國際化（i18n）架構。
*   **支援語系**：為了符合工業區外籍員工比例，完整配置並翻譯了 **五國語言**：
    1.  **🇹🇼 中文 (zh)**
    2.  **🇹🇭 泰文 (th)**
    3.  **🇻🇳 越南文 (vi)**
    4.  **🇲🇲 緬甸文 (my)**
    5.  **🇰🇭 柬埔寨/高棉文 (km)**
*   **翻譯建置**：於 `/messages` 目錄下建立對應的語系 JSON 檔，收錄店面資訊、主食、湯品及小菜的精準對照翻譯。

### 階段二：雙端產品設計與實作
*   **【網頁版】動態切換首頁 (`src/app/[locale]/page.tsx`)**：
    *   實作右上角語系切換按鈕，點擊即可無縫刷新整頁語系。
    *   以現代、溫暖的橘黃色調（代表美味與喜氣的食物）設計自適應網格（CSS Grid），列出 10 款主食、4 款湯品與 4 款小菜。
    *   串接響應式頁尾，完整呈現店面地址、電話與預訂須知。
*   **【實體版】A4 多語並列宣傳單 (`public/flyer.html`)**：
    *   **設計初衷**：工廠環境中，外籍員工不一定隨時方便用手機上網。一張實體的、多語並列的菜單貼在牆上最為實用。
    *   **版面規劃**：精確控制 CSS 尺寸符合 **A4 直式標準 (210mm x 296mm)**。
    *   **多語並列顯示**：與網頁版不同，宣傳單將 6 大熱銷便當（雞腿、牛肉、滷肉、蝦捲、鮮魚、控肉）的五國語言譯名與價格**同時並列呈現在單張上**，一目了然。
    *   **智慧列印優化**：利用 `@media print` 進行版面優化，並加上「一鍵列印」按鈕（列印時自動隱藏按鈕本身）。
    *   **虛實整合**：附帶 QR Code，方便掃描直接進入網路版切換細部菜單。
*   **【主食真實圖片更新】**：
    *   **雙主菜實體照生成**：針對「雙主菜(魚/控肉)便當」，依據使用者提供的實體照風格（圓形白紙盒、不鏽鋼廚房檯面背景、家常真實手機拍攝感），使用 AI 生成了一張極具真實感的「雙主菜(魚/控肉)便當」示意圖，存放於 `public/images/double_main.png`。同步修改 `src/app/[locale]/page.tsx` 中 `id: 1` 的雙主菜便當圖片路徑，使其擺脫先前的佔位符（或無對應圖片狀態），達成網頁端的視覺一致性。
    *   **菜飯便當實體照生成**：針對「菜飯便當」（`id: 8`），採用同系列的手機隨手拍實景風格，生成以多樣清爽健康蔬菜（高麗菜、青菜、筍絲、油豆腐等）覆蓋在白飯上、無肉無魚的純菜飯便當照，並將新生成的實拍圖替換至 `public/images/veg.png`，完成網頁端視覺統一。

---

## ⚠️ 遇到的困難與解決方案 (Troubleshooting & Solutions)

### 1. Next.js 新版本與 next-intl 的相容性與路由配置
*   **遇到的困難**：Next.js 的 App Router 升級後，與舊版的 `next-intl` 路由寫法有衝突，容易導致語系參數解析失敗或頁面丟失（404）。
*   **解決方案**：
    *   嚴格遵循 `next-intl` 最新官方文件規範。
    *   在 `src/i18n/routing.ts` 中使用 `defineRouting` 與 `createNavigation` 來統一包裝導航組件。
    *   在專案根目錄建立 `src/middleware.ts` 進行國際化路由攔截，確保 `/zh`、`/th` 等語系路徑正常映射。

### 2. 異步路由參數 (Asynchronous Params) 的類型警告
*   **遇到的困難**：Next.js 在較新版本中，將 `Page` 的 `params` 轉變為異步 `Promise` 物件。如果直接使用 `params.locale`，會觸發編譯錯誤。
*   **解決方案**：
    *   將首頁組件 `Home` 宣告為 `async function`。
    *   在首頁頂部使用 `const { locale } = await params;` 進行解構與等待，解決類型警告並確保語系安全載入。

### 3. 多國特殊語系字型不相容與長度跑版
*   **遇到的困難**：
    *   緬甸文 (Burmese) 與高棉文 (Khmer) 的字型在許多 Windows/Mac 系統預設中可能缺字而顯示為「豆腐塊」(空白方格)。
    *   東南亞語系的詞彙長度通常比中文長 2~3 倍，容易撐開卡片導致排版凌亂，甚至傳單溢出 A4 單頁限制。
*   **解決方案**：
    *   **字型相容性**：在 CSS font-family 中加入多個備用字型，如 `Segoe UI Historic`, `Tahoma`, `Noto Sans Myanmar`, `Noto Sans Khmer` 等，確保在各種系統上的基本渲染。
    *   **防跑版排版**：傳單與網頁卡片全面採用 `flex-direction: column` 或 `grid` 彈性伸縮排版，並配合 `overflow: hidden` 與精確的 `height` 控制（例如主食卡片高度限制），避免因個別語言字數過多而破壞整體 A4 紙張的黃金比例。

### 階段三：GitHub 建倉、Vercel 部署、真實圖片整合（2026-05-20）

*   **GitHub 倉庫建立**：
    *   於 `FAUST-777/xi-cai-bento-shop` 建立公開 repo，完整上傳所有原始碼。
    *   設定 GitHub 首頁預覽網址為 `https://bento-shop.vercel.app/zh`。

*   **真實便當照片整合**：
    *   對照 git 歷史還原原始 AI 圖片對應關係（beef.png → 牛肉便當、braised_pork.png → 控肉便當 等）。
    *   以中文命名的實拍照片優先覆蓋，舊 AI 圖片保留備用：
        | id | 菜單 | 已更新為實拍 |
        |----|------|------------|
        | 2 | 牛肉便當 | `牛肉便當.jpg` ✓ |
        | 3 | 控肉便當 | `控肉便當.jpg` ✓ |
        | 4 | 蝦捲便當 | `蝦捲便當.jpg` ✓ |
        | 5 | 鮮魚便當 | `鮮魚便當.jpg` ✓ |
        | 6 | 雞腿便當 | `雞腿便當.jpg` ✓ |
    *   id 1、7、8、9、10 暫用舊 AI 圖，待後續實拍補充。

*   **Vercel 正式部署**：
    *   Vercel CLI 因 Node.js 18 引擎不相容（CLI v47+ 需要 Node 20+），改用 **Vercel REST API** (`v13/deployments`) 直接觸發部署。
    *   傳入 `gitSource`（GitHub repoId + sha）成功建立 Production deployment。
    *   正式網址：`https://bento-shop.vercel.app`

*   **Claude Code 自動同步 Hook**：
    *   於 `.claude/settings.json` 加入 **Stop hook**，Claude 每次結束對話後自動執行 `git add -A → commit → push`，確保進度即時備份至 GitHub。

### 階段四：GPT-4o 風格模擬照片生成 & 全菜單圖片完成（2026-05-20）

#### 📸 圖片製作流程說明

本專案的便當照片分為**兩個批次**，採用不同的取得方式：

**第一批（真實廚師拍攝）— 5 張**

由廚師以手機在廚房現場拍攝，照片風格特徵：
- 容器：圓形白色紙盒（外帶便當盒）
- 背景：不鏽鋼廚房檯面，真實廚房環境
- 光線：自然室內光，家常手機拍攝感
- 構圖：俯視或微斜角，便當填滿畫面

| 檔名 | 菜單項目 |
|------|---------|
| `牛肉便當.jpg` | id 2 牛肉便當 |
| `控肉便當.jpg` | id 3 控肉便當 |
| `蝦捲便當.jpg` | id 4 蝦捲便當 |
| `鮮魚便當.jpg` | id 5 鮮魚便當 |
| `雞腿便當.jpg` | id 6 雞腿便當 |

**第二批（GPT-4o 風格模擬生成）— 5 張**

以第一批真實照片作為風格參考，透過 GPT-4o 的圖片理解與生成能力，模擬出相同風格的便當示意圖。

**操作步驟：**
1. 上傳第一批 1～2 張真實便當照片給 GPT-4o
2. 描述風格關鍵字：「圓形白紙外帶便當盒、不鏽鋼廚房檯面背景、家常手機拍攝感、俯視角度」
3. 指定要生成的菜色內容（如：滷肉便當、菜飯便當、炒麵…）
4. GPT-4o 根據風格參考與描述生成對應圖片
5. 將生成結果另存為中文命名 PNG 檔

| 檔名 | 菜單項目 | 生成方式 |
|------|---------|---------|
| `雙主菜便當_.png` | id 1 雙主菜 | GPT-4o 生成 |
| `滷肉便當_.png` | id 7 滷肉便當 | GPT-4o 生成 |
| `菜飯便當_.png` | id 8 菜飯便當 | GPT-4o 生成 |
| `炒麵_.png` | id 9 炒麵 | GPT-4o 生成 |
| `滷肉飯_.png` | id 10 滷肉飯 | GPT-4o 生成 |

**結果：** 全部 10 道主食圖片齊全，視覺風格一致，網站菜單呈現完整。

---

## 🔄 未來進度更新與維護機制
1.  **里程碑自動同步**：每當完成一個階段的修改，會同步更新此 `DEVELOPMENT_LOG.md`。
2.  **GitHub 實時推送**：專案程式碼與本開發日誌將在每次段落結束後，一併 push 至 GitHub 遠端倉庫保存。
3.  **圖片待補清單**：id 1（雙主菜）、id 7（滷肉便當）、id 8（菜飯便當）、id 9（炒麵）、id 10（滷肉飯）尚待實拍照片，建議用 ChatGPT/Midjourney 依現有照片風格生成或另行拍攝。

---

### 階段五：Google Tag Manager (GTM) 整合（2026-05-26）

#### 🎯 目標
為網站加入 Google Tag Manager（Container ID：`GTM-PF2PCDCT`），以便後續追蹤訪客行為、按鈕點擊、頁面瀏覽等數據。

#### 📝 修改內容

**修改檔案：`src/app/[locale]/layout.tsx`**

Next.js App Router 不能直接使用原始 HTML `<script>` 標籤，必須透過 `next/script` 元件管理載入行為：

| GTM 官方指引 | Next.js 做法 | 原因 |
|---|---|---|
| `<script>` 放 `<head>` | `<Script strategy="afterInteractive">` 放 `<body>` 底部 | 頁面 hydrate 後才執行，效能最佳 |
| `<noscript>` 緊靠 `<body>` 開頭 | 原生 `<noscript>` 放 `<body>` 最頂 | 直接 JSX 渲染，無需改動 |
| 直接寫 inline `<script>` | `dangerouslySetInnerHTML` | App Router 限制，必須走此 API |

新增的兩段代碼：
1. `<noscript>` iframe — 緊靠 `<body>` 開頭，供關閉 JS 的瀏覽器使用
2. `<Script id="gtm-script" strategy="afterInteractive">` — GTM 主腳本，頁面互動後載入

---

#### ⚠️ 遇到的困難與解決方案

**問題 1：Vercel 未自動部署新 commit**
- **現象**：將 GTM commit（`3e116e5`）push 至 GitHub main branch 後，Vercel 沒有自動觸發新部署，Production 仍停留在 5/20 的舊版本（`a784949`）。
- **錯誤嘗試**：在 Vercel Dashboard 點擊「Redeploy」，但此操作是重新執行**舊 commit 的部署**，不會拉取最新 commit，GTM 依然未出現。
- **解決方案**：改用 Vercel CLI 強制部署最新代碼：
  ```bash
  npx vercel --prod
  ```

**問題 2：CLI 部署到錯誤的 Vercel 專案**
- **現象**：`npx vercel --prod` 成功執行，但 alias 到的是 `xi-cai-bento-shop.vercel.app`，而非使用者實際使用的 `bento-shop.vercel.app`。原因是 CLI 依據本地 repo 名稱自動 link 到了同名的 Vercel 專案（`xi-cai-bento-shop`），而非目標專案（`bento-shop`）。
- **解決方案**：明確指定 scope 與 project name：
  ```bash
  npx vercel --prod --scope faust777s-projects --project bento-shop
  ```

#### ✅ 最終驗證

部署完成後，透過 `curl` 抓取頁面原始碼確認 GTM 成功埋入：

```
GTM-PF2PCDCT    ✅ 出現（noscript iframe + script 兩處）
googletagmanager.com  ✅ 正確引用
dataLayer       ✅ 初始化完成
```

正式網址：`https://bento-shop.vercel.app/zh`

