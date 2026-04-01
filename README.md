<div align="center">

# Image Prompt Generator

**AI 多模态图片识别 & 绘画提示词生成器**

上传任意图片，AI 自动分析内容、风格、构图、色彩与光影，  
输出可直接用于 Midjourney / Stable Diffusion / DALL-E 的中英文提示词。

[![Release](https://img.shields.io/github/v/release/Iroha-P/Image-Prompt-Generator?style=flat-square&color=6366f1)](https://github.com/Iroha-P/Image-Prompt-Generator/releases)
[![License](https://img.shields.io/github/license/Iroha-P/Image-Prompt-Generator?style=flat-square&color=8b5cf6)](LICENSE)

</div>

---

## Screenshots

<table>
<tr>
<td width="65%">

**Web 全屏模式**

<img src="assets/screenshots/web-demo.png" alt="Web Demo" />

</td>
<td width="35%">

**Chrome 扩展弹窗**

<img src="assets/screenshots/popup-demo.png" alt="Extension Popup Demo" />

</td>
</tr>
</table>

---

## Features

| | 特性 | 说明 |
|:---:|---|---|
| **🖼** | 多种图片输入 | 拖拽上传、点击选择、粘贴 URL、右键网页图片 |
| **🤖** | 6 家 AI 服务商 | 硅基流动 / Google Gemini / Claude / OpenAI / OpenCode / Vtrix |
| **🧠** | 丰富的模型 | Gemini 3.1 Pro、Claude Opus 4.5、GPT-5.2 等 |
| **🔄** | 双模式运行 | Chrome 扩展 + 独立网页，按需切换 |
| **📋** | 一键复制 | 生成结果一键复制到剪贴板 |
| **💾** | 设置持久化 | API Key 和偏好自动保存到本地 |

---

## Supported Providers

| 服务商 | 推荐场景 | 格式 |
|---|---|---|
| **硅基流动 SiliconFlow** | 国内首选，有免费模型 | OpenAI 兼容 |
| **Google Gemini** | Gemini 3 系列，高质量多模态 | Gemini API |
| **Anthropic Claude** | Claude Sonnet / Haiku，稳定可靠 | Anthropic API |
| **OpenAI** | GPT-4o 系列 | OpenAI API |
| **OpenCode Zen** | 多模型聚合 | OpenAI 兼容 |
| **Vtrix** | 全模型聚合 (Gemini / Claude / GPT) | OpenAI 兼容 |

---

## Quick Start

### 方式一 · 独立网页

直接在浏览器中打开 `index.html`，拖拽图片或粘贴 URL 即可。

### 方式二 · Chrome 扩展

1. 打开 `chrome://extensions/`，开启 **开发者模式**
2. 点击「加载已解压的扩展程序」，选择本项目文件夹
3. 在网页中 **右键任意图片** → 选择「识别图片并生成提示词」
4. 或点击扩展弹窗中的 🖥️ 按钮进入全屏上传模式

### 配置 API Key

首次使用点击右上角「设置」→ 选择服务商 → 填入 API Key → 选择模型 → 保存。

---

## Project Structure

```
Image-Prompt-Generator/
│
├─ 🌐 Web 独立网页
│  ├─ index.html          入口页面
│  ├─ app.js              交互逻辑 & API 调用
│  └─ style.css           样式
│
├─ 🧩 Chrome 扩展
│  ├─ manifest.json       扩展配置
│  ├─ background.js       Service Worker (API 调用)
│  ├─ popup.html          弹窗页面
│  ├─ popup.js            弹窗逻辑
│  └─ popup.css           弹窗样式
│
└─ 📄 README.md
```

---

## Output Example

```
【中文描述】
一幅赛博朋克风格的城市夜景，霓虹灯光映照在潮湿的街道上，远处高楼林立。

【English Prompt】
cyberpunk cityscape at night, neon lights reflecting on wet streets,
towering skyscrapers in the background, rain-soaked atmosphere,
volumetric lighting, cinematic composition, ultra-detailed,
purple and blue color palette, blade runner aesthetic, 8k resolution
```

---

## Privacy

- 所有 API Key **仅存储在本地浏览器**（localStorage / chrome.storage），不会上传到任何服务器
- 图片数据仅在调用 AI 接口时传输给所选服务商，本工具不保存任何图片

## License

[MIT](LICENSE)
