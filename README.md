# 🐍 貪食蛇 Snake Game

純前端貪食蛇遊戲，**不使用任何資料庫、後端或 API**，下載/開啟即玩。

![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange) ![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-yellow) ![No DB](https://img.shields.io/badge/Database-None-green)

## 玩法

- 吃到 🍎 得 **10 分**，蛇身變長
- 每吃 5 顆速度提升一次
- 撞牆或撞到自己 → 遊戲結束
- 最高分只存在瀏覽器 `localStorage`（換瀏覽器/清除資料會重置）

## 操作

| 操作 | 按鍵 |
|---|---|
| 移動 | 方向鍵 ↑ ↓ ← → 或 WASD |
| 開始 / 暫停 | 空白鍵 |
| 手機 | 滑動畫面，或使用畫面下方方向按鈕 |

## 功能

- 三種難度：簡單 / 普通 / 困難
- 分數、最高分、長度、速度即時顯示
- 暫停 / 繼續 / 重新開始
- 響應式版面，支援手機觸控
- 無外部依賴、無 build 步驟

## 快速開始

直接用瀏覽器開啟 `index.html`，或起一個靜態 server：

```bash
# Python
python3 -m http.server 8000
# 然後開啟 http://localhost:8000

# 或 Node.js
npx serve .
```

也可以部署到 GitHub Pages：Repo → Settings → Pages → Branch 選 `main` / root 即可。

## 專案結構

```
snake-game/
├── index.html   # 頁面結構
├── style.css    # 樣式（深色主題、響應式）
├── game.js      # 遊戲邏輯（Canvas、碰撞、計分、加速）
└── README.md
```

## 技術

- HTML5 Canvas 繪製棋盤、蛇與食物
- Vanilla JavaScript，無框架、無資料庫
- `localStorage` 保存最高分

## License

MIT
