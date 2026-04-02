[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md)

# Image Prompt Generator

画像をアップロードまたは選択すると、AI が被写体、スタイル、構図、色彩、光の表現を分析し、Midjourney、Stable Diffusion、DALL-E などで使える英語プロンプトを生成するマルチモーダル画像解析ツールです。

## スクリーンショット

### Web モード

![Web Demo](assets/screenshots/web-demo.png)

### 拡張機能ポップアップ

![Popup Demo](assets/screenshots/popup-demo.png)

## 主な機能

- **複数の画像入力方法**：ドラッグ＆ドロップ、ファイル選択、画像 URL、Web 画像の右クリック
- **複数の AI プロバイダー**：SiliconFlow、Google Gemini、Anthropic Claude、OpenAI、OpenCode Zen、Vtrix
- **豊富なモデル**：Gemini 3.1 Pro、Claude Opus 4.5、GPT-5.2 など
- **2 つの実行モード**：Chrome 拡張機能とスタンドアロン Web ツール
- **ワンクリックコピー**：生成結果を素早くコピー可能
- **多言語 UI**：日本語、英語、中国語に対応し、初回はブラウザ言語を自動検出

## 対応プロバイダー

| プロバイダー | 用途 | API 形式 |
|---|---|---|
| **SiliconFlow** | 中国圏ユーザー向けおすすめ | OpenAI 互換 |
| **Google Gemini** | 高品質なマルチモーダル認識 | Gemini API |
| **Anthropic Claude** | 安定した推論品質 | Anthropic API |
| **OpenAI** | GPT-4o 系列 | OpenAI API |
| **OpenCode Zen** | 複数モデルの集約 | OpenAI 互換 |
| **Vtrix** | Gemini / Claude / GPT を一括利用 | OpenAI 互換 |

## 使い方

### 1. Web ツールとして使う

`index.html` をブラウザで開き、画像をアップロードするか URL を貼り付けます。

### 2. Chrome 拡張機能として使う

1. Chrome で `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」から本プロジェクトを選択
4. Web ページ上の画像を右クリックしてプロンプト生成
5. ポップアップ内の全画面ボタンからアップロードモードへ切り替え可能

## プロジェクト構成

```text
Image-Prompt-Generator/
├─ Web ツール
│  ├─ index.html      # エントリーページ
│  ├─ app.js          # ページロジックと API 呼び出し
│  ├─ i18n.js         # 日英中の翻訳辞書
│  └─ style.css       # スタイル
├─ Chrome 拡張
│  ├─ manifest.json   # 拡張設定
│  ├─ background.js   # Service Worker / API 呼び出し
│  ├─ popup.html      # ポップアップ画面
│  ├─ popup.js        # ポップアップロジック
│  └─ popup.css       # ポップアップスタイル
├─ assets/
│  └─ screenshots/    # README 用画像
└─ README*.md         # 多言語ドキュメント
```

## 出力例

```text
【日本語の説明】
夕暮れの窓辺で振り向いて微笑む、濃い紫色の髪と緑の瞳を持つ少女のアニメ風カット。窓ガラスには淡い反射が映り、全体にやわらかく懐かしい雰囲気がある。

【English Prompt】
anime style, a young girl with dark purple hair in a low bun, green eyes, smiling, looking back over her shoulder, wearing a white sailor uniform with red trim. She is indoors near a window. Outside the window is a dusk or twilight sky with orange and dark blue hues. The girl's faint reflection can be seen on the window glass. Soft lighting, nostalgic atmosphere, 2d animation, high quality, cinematic composition.
```

## プライバシー

- API キーはローカルブラウザ内（`localStorage` / `chrome.storage`）にのみ保存されます
- 画像データは選択した AI プロバイダーへ送信されるだけで、本ツール自体は保存しません

## License

MIT
