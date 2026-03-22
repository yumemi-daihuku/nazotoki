# 🕯️ ホラーARG謎解きゲーム — セットアップガイド

## ファイル構成

```
horror-arg/
├── index.html       入口ページ（怪異報告書 + スクロール数字謎）
├── terminal.html    第1関門：ターミナル認証コード入力
├── archive.html     第2関門：パスワード入力
├── signal.html      第3関門：モールス信号LED点滅を解読
└── end.html         エンディング
```

---

## 謎の構造と答え（デフォルト）

| ページ | 仕掛け | 答え |
|--------|--------|------|
| `index.html` | スクロールで数字が出現、積を計算 | **7 × 5 × 3 × 9 = 945** |
| `terminal.html` | 入力フォームに積を入力 | **945** |
| `archive.html` | キーワード入力 | **kagami（鏡）** |
| `signal.html` | LEDランプのモールス信号を解読 | **YOMI** |

---

## カスタマイズ方法

### 謎の数字を変える（index.html）
```html
<!-- 各 .digit-reveal の中の数字を書き換える -->
<span class="digit-reveal" id="d1">7</span>
<span class="digit-reveal" id="d2">5</span>
<span class="digit-reveal" id="d3">3</span>
<span class="digit-reveal" id="d4">9</span>
```
```javascript
// JSのDIGITS配列も同じ数字に揃える
const DIGITS = [
  { id: 'd1', value: 7 },
  ...
];
```

### terminal.html のコードを変える
```javascript
const CONFIG = {
  CORRECT_CODE: '945',   // ← index.html の積と合わせる
};
```

### archive.html のパスワードを変える
```javascript
const CONFIG = {
  ANSWERS: ['kagami', 'かがみ', '鏡'],
};
```

### signal.html の答え（モールス信号の単語）を変える
```javascript
const CONFIG = {
  SECRET_WORD: 'YOMI',                   // モールス信号で送信する単語
  ANSWERS: ['YOMI', 'yomi', '黄泉'],    // 正解として認める文字列
};
```

---

## GitHub Pages へのデプロイ

1. GitHubで新しいリポジトリを作成
2. 5つのHTMLファイルをすべてpush
3. Settings → Pages → Source: `main` ブランチのルート
4. `https://<username>.github.io/<repo>/` でアクセス可能
