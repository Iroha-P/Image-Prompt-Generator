# Image Prompt Generator / 图片提示词生成器

一个基于多模态 AI 的图片识别与提示词生成工具。上传或选取图片，AI 自动分析内容、风格、构图、光影等元素，输出可直接用于 Midjourney、Stable Diffusion、DALL-E 等 AI 绘画工具的英文提示词，同时附带中文描述摘要。

## 功能特点

- **多种图片输入方式** — 拖拽上传、点击选择文件、粘贴图片 URL、右键网页图片
- **多家 AI 服务商支持** — 硅基流动、Google Gemini、Anthropic Claude、OpenAI、OpenCode Zen、Vtrix
- **丰富的模型选择** — 从免费模型到旗舰模型，包括 Gemini 3.1 Pro、Claude Opus 4.5、GPT-5.2 等
- **双形态运行** — 既可作为 Chrome 扩展使用（右键识别网页图片），也可作为独立网页工具使用
- **一键复制** — 生成的提示词可一键复制到剪贴板
- **设置持久化** — API Key 和偏好设置自动保存

## 支持的 AI 服务商

| 服务商 | 推荐场景 | API 格式 |
|---|---|---|
| **硅基流动 SiliconFlow** | 国内用户首选，有免费模型 | OpenAI 兼容 |
| **Google Gemini** | Gemini 3 系列，高质量多模态 | Gemini API |
| **Anthropic Claude** | Claude Sonnet/Haiku，稳定可靠 | Anthropic API |
| **OpenAI** | GPT-4o 系列 | OpenAI API |
| **OpenCode Zen** | 多模型聚合 | OpenAI 兼容 |
| **Vtrix** | 全模型聚合（Gemini/Claude/GPT） | OpenAI 兼容 |

## 使用方式

### 方式一：独立网页工具

直接在浏览器中打开 `index.html`，拖拽图片或粘贴 URL 即可使用。

### 方式二：Chrome 扩展

1. 打开 Chrome，进入 `chrome://extensions/`
2. 开启右上角「开发者模式」
3. 点击「加载已解压的扩展程序」，选择本项目文件夹
4. 在网页中右键任意图片 → 选择「识别图片并生成提示词」
5. 也可点击扩展弹窗中的 🖥️ 按钮进入全屏上传模式

### 配置 API Key

首次使用需配置 API Key：

1. 点击「设置」按钮
2. 选择 API 服务商
3. 填入对应的 API Key（从服务商官网获取）
4. 选择模型并保存

## 项目结构

```
├── index.html        # 独立网页工具入口
├── app.js            # 网页工具逻辑（API 调用 + UI 交互）
├── style.css         # 网页工具样式
├── manifest.json     # Chrome 扩展配置
├── background.js     # 扩展 Service Worker（API 调用）
├── popup.html        # 扩展弹窗页面
├── popup.js          # 扩展弹窗逻辑
├── popup.css         # 扩展弹窗样式
└── README.md
```

## 输出示例

```
【中文描述】
一幅赛博朋克风格的城市夜景，霓虹灯光映照在潮湿的街道上，远处高楼林立。

【English Prompt】
cyberpunk cityscape at night, neon lights reflecting on wet streets,
towering skyscrapers in the background, rain-soaked atmosphere,
volumetric lighting, cinematic composition, ultra-detailed,
purple and blue color palette, blade runner aesthetic, 8k resolution
```

## 隐私说明

- 所有 API Key 仅存储在本地浏览器中（localStorage / chrome.storage），不会上传到任何服务器
- 图片数据仅在调用 AI 接口时传输给所选的 API 服务商，本工具不保存任何图片

## License

MIT
