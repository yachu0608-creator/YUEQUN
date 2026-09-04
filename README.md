# YUEQUN

越群汽車修配廠網站原始專案。React、TypeScript、Vite。

請先閱讀 [HANDOFF.md](HANDOFF.md)，內含設計來源、操作規則與尚未完成事項。

```sh
npm install -g pnpm@10
pnpm install --frozen-lockfile
pnpm dev
```

Node.js 請使用 22.12 或更新的相容版本。

```sh
pnpm build
pnpm preview
```

Netlify 匯入此 repository 時，Base directory 留空、Build command 為 `pnpm build`、Publish directory 為 `dist`；設定也已包含在 netlify.toml。

這是待完成驗收的前端版本：Banner 自動輪播、部分手機 QA 及正式 LINE 預約連結仍待處理。評論使用設計示意資料。不要直接雙擊 index.html 開啟。

