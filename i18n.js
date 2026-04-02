(function initImagePromptI18n(global) {
  const LANGUAGE_STORAGE_KEY = "ip_lang";
  const SUPPORTED_LANGUAGES = ["en", "zh", "ja"];
  const HTML_LANGUAGE_MAP = {
    en: "en",
    zh: "zh-CN",
    ja: "ja"
  };

  const messages = {
    en: {
      pageTitleWeb: "Image Prompt Generator",
      pageTitlePopup: "Image Prompt Generator",
      brandText: "Image Prompt Generator",
      settings: "Settings",
      toggleKeyVisibility: "Show or hide API key",
      languageLabel: "Language",
      heroBadge: "AI Vision Prompt Tool",
      heroTitle: "Upload images and generate high-quality art prompts",
      heroDescription: "Supports local uploads, image URLs, and right-click image recognition from web pages. Automatically analyzes subject, style, composition, color, and lighting, then generates a localized summary plus an English prompt for Midjourney, Stable Diffusion, DALL-E, and more.",
      heroPill1: "Multimodal vision",
      heroPill2: "Multi-provider support",
      heroPill3: "Extension + web modes",
      heroTipLabel: "Recommended flow",
      heroStep1: "Choose your API provider and model in Settings",
      heroStep2: "Drop an image or paste an image URL",
      heroStep3: "Generate and copy the prompt",
      apiSettings: "API Settings",
      providerLabel: "API Provider",
      apiKeyLabel: "API Key",
      modelLabel: "Model",
      saveSettings: "Save Settings",
      dropTitle: "Drag an image here or click to upload",
      dropHint: "Supports JPG, PNG, GIF, and WebP",
      orLabel: "or",
      urlPlaceholder: "Paste an image URL...",
      loadButton: "Load",
      uploadNote: "Tip: image URLs may be blocked by CORS in standalone web mode. Local upload is recommended.",
      previewTitle: "Image Preview",
      changeImage: "Change Image",
      generatePrompt: "Generate Prompt",
      generating: "Analyzing...",
      generatedPrompt: "Generated Prompt",
      copy: "Copy",
      emptyTitle: "No image selected",
      emptyHint: "Right-click any image on a webpage and choose \"Recognize image and generate prompt\"",
      popupTitle: "Image Prompt Generator",
      popupSubtitle: "Right-click a web image to recognize and generate prompts",
      fullscreenTitle: "Fullscreen upload mode",
      contextMenuTitle: "Recognize image and generate prompt",
      langEnglish: "English",
      langChinese: "中文",
      langJapanese: "日本語",
      toastEnterApiKey: "Please enter an API key",
      toastSettingsSaved: "Settings saved",
      toastEnterImageUrl: "Please enter an image URL",
      toastLoadingImage: "Loading image...",
      toastImageLoadFailed: "Failed to load image: {message}",
      toastDropImageFile: "Please drop an image file",
      toastSelectImageFirst: "Please select an image first",
      toastConfigApiKeyFirst: "Please configure your API key in Settings first",
      toastCopied: "Copied to clipboard",
      resultFailed: "Generation failed: {message}",
      errorCannotAccessImageUrl: "Cannot access the image URL. This may be caused by a CORS restriction.",
      errorImageDownloadHttp: "Image download failed (HTTP {status})",
      errorConnectProvider: "Unable to connect to {provider} API. Please check your network connection. ({message})",
      errorApiRequestFailed: "{provider} API request failed ({status})",
      errorCheck403: "\n\nPlease check: 1) your API key 2) account verification status 3) whether the selected model is available",
      noApiKeyConfigured: "API key is not configured. Please enter it in Settings.",
      apiLinkSiliconflow: "Get SiliconFlow API Key ->",
      apiLinkGoogle: "Get Google API Key ->",
      apiLinkAnthropic: "Get Claude API Key ->",
      apiLinkOpenAI: "Get OpenAI API Key ->",
      apiLinkOpenCode: "Get OpenCode API Key ->",
      apiLinkVtrix: "Get Vtrix API Key ->"
    },
    zh: {
      pageTitleWeb: "图片提示词生成器",
      pageTitlePopup: "图片提示词生成器",
      brandText: "Image Prompt Generator",
      settings: "设置",
      toggleKeyVisibility: "显示或隐藏 API Key",
      languageLabel: "语言",
      heroBadge: "AI Vision Prompt Tool",
      heroTitle: "上传图片，自动生成高质量绘图提示词",
      heroDescription: "支持本地上传、图片 URL、网页右键识图，自动分析主体、风格、构图、色彩和光影，输出适用于 Midjourney、Stable Diffusion、DALL-E 等工具的中文摘要与英文提示词。",
      heroPill1: "多模态识图",
      heroPill2: "多服务商切换",
      heroPill3: "扩展 + 网页双模式",
      heroTipLabel: "推荐流程",
      heroStep1: "先在右上角设置 API 与模型",
      heroStep2: "拖拽图片或粘贴图片链接",
      heroStep3: "点击生成并复制提示词",
      apiSettings: "API 设置",
      providerLabel: "API 服务商",
      apiKeyLabel: "API Key",
      modelLabel: "模型",
      saveSettings: "保存设置",
      dropTitle: "拖拽图片到这里，或点击上传",
      dropHint: "支持 JPG、PNG、GIF、WebP 格式",
      orLabel: "或者",
      urlPlaceholder: "粘贴图片 URL 地址...",
      loadButton: "加载",
      uploadNote: "提示：独立网页使用图片 URL 时可能受跨域限制，优先推荐本地上传。",
      previewTitle: "图片预览",
      changeImage: "更换图片",
      generatePrompt: "生成提示词",
      generating: "识别中...",
      generatedPrompt: "生成的提示词",
      copy: "复制",
      emptyTitle: "暂无选中的图片",
      emptyHint: "在网页中右键点击任意图片，选择「识别图片并生成提示词」",
      popupTitle: "图片提示词生成器",
      popupSubtitle: "右键点击网页图片 -> 识别并生成提示词",
      fullscreenTitle: "全屏上传模式",
      contextMenuTitle: "识别图片并生成提示词",
      langEnglish: "English",
      langChinese: "中文",
      langJapanese: "日本語",
      toastEnterApiKey: "请输入 API Key",
      toastSettingsSaved: "设置已保存",
      toastEnterImageUrl: "请输入图片 URL",
      toastLoadingImage: "正在加载图片...",
      toastImageLoadFailed: "图片加载失败: {message}",
      toastDropImageFile: "请拖入图片文件",
      toastSelectImageFirst: "请先选择一张图片",
      toastConfigApiKeyFirst: "请先在设置中配置 API Key",
      toastCopied: "已复制到剪贴板",
      resultFailed: "生成失败: {message}",
      errorCannotAccessImageUrl: "无法访问图片地址，可能存在跨域限制",
      errorImageDownloadHttp: "图片下载失败 (HTTP {status})",
      errorConnectProvider: "无法连接 {provider} API。请检查网络连接。({message})",
      errorApiRequestFailed: "{provider} API 请求失败 ({status})",
      errorCheck403: "\n\n请检查: 1) API Key 是否正确 2) 账户是否已完成实名认证 3) 所选模型是否可用",
      noApiKeyConfigured: "未配置 API Key，请在设置中填写",
      apiLinkSiliconflow: "获取硅基流动 API Key ->",
      apiLinkGoogle: "获取 Google API Key ->",
      apiLinkAnthropic: "获取 Claude API Key ->",
      apiLinkOpenAI: "获取 OpenAI API Key ->",
      apiLinkOpenCode: "获取 OpenCode API Key ->",
      apiLinkVtrix: "获取 Vtrix API Key ->"
    },
    ja: {
      pageTitleWeb: "画像プロンプト生成ツール",
      pageTitlePopup: "画像プロンプト生成ツール",
      brandText: "Image Prompt Generator",
      settings: "設定",
      toggleKeyVisibility: "API キーの表示/非表示",
      languageLabel: "言語",
      heroBadge: "AI Vision Prompt Tool",
      heroTitle: "画像をアップロードして高品質な描画プロンプトを生成",
      heroDescription: "ローカル画像、画像 URL、Web ページ上の右クリック画像認識に対応。被写体、スタイル、構図、色、光を自動分析し、各言語の要約と英語プロンプトを Midjourney、Stable Diffusion、DALL-E など向けに生成します。",
      heroPill1: "マルチモーダル解析",
      heroPill2: "複数プロバイダー対応",
      heroPill3: "拡張機能 + Web モード",
      heroTipLabel: "おすすめ手順",
      heroStep1: "右上の設定から API とモデルを選択",
      heroStep2: "画像をドラッグするか画像 URL を貼り付け",
      heroStep3: "生成してプロンプトをコピー",
      apiSettings: "API 設定",
      providerLabel: "API プロバイダー",
      apiKeyLabel: "API キー",
      modelLabel: "モデル",
      saveSettings: "設定を保存",
      dropTitle: "ここに画像をドラッグするか、クリックしてアップロード",
      dropHint: "JPG、PNG、GIF、WebP に対応",
      orLabel: "または",
      urlPlaceholder: "画像 URL を貼り付け...",
      loadButton: "読み込む",
      uploadNote: "ヒント: スタンドアロン Web モードでは画像 URL が CORS 制限を受ける場合があります。ローカルアップロードを推奨します。",
      previewTitle: "画像プレビュー",
      changeImage: "画像を変更",
      generatePrompt: "プロンプトを生成",
      generating: "解析中...",
      generatedPrompt: "生成されたプロンプト",
      copy: "コピー",
      emptyTitle: "選択された画像がありません",
      emptyHint: "Web ページ上の画像を右クリックし、「画像を認識してプロンプトを生成」を選択してください",
      popupTitle: "画像プロンプト生成ツール",
      popupSubtitle: "Web 画像を右クリックして認識・プロンプト生成",
      fullscreenTitle: "全画面アップロードモード",
      contextMenuTitle: "画像を認識してプロンプトを生成",
      langEnglish: "English",
      langChinese: "中文",
      langJapanese: "日本語",
      toastEnterApiKey: "API キーを入力してください",
      toastSettingsSaved: "設定を保存しました",
      toastEnterImageUrl: "画像 URL を入力してください",
      toastLoadingImage: "画像を読み込み中...",
      toastImageLoadFailed: "画像の読み込みに失敗しました: {message}",
      toastDropImageFile: "画像ファイルをドロップしてください",
      toastSelectImageFirst: "先に画像を選択してください",
      toastConfigApiKeyFirst: "先に設定画面で API キーを入力してください",
      toastCopied: "クリップボードにコピーしました",
      resultFailed: "生成に失敗しました: {message}",
      errorCannotAccessImageUrl: "画像 URL にアクセスできません。CORS 制限の可能性があります。",
      errorImageDownloadHttp: "画像のダウンロードに失敗しました (HTTP {status})",
      errorConnectProvider: "{provider} API に接続できません。ネットワーク接続を確認してください。({message})",
      errorApiRequestFailed: "{provider} API リクエスト失敗 ({status})",
      errorCheck403: "\n\n確認してください: 1) API キー 2) アカウント認証状況 3) 選択モデルが利用可能か",
      noApiKeyConfigured: "API キーが未設定です。設定画面で入力してください。",
      apiLinkSiliconflow: "SiliconFlow API Key を取得 ->",
      apiLinkGoogle: "Google API Key を取得 ->",
      apiLinkAnthropic: "Claude API Key を取得 ->",
      apiLinkOpenAI: "OpenAI API Key を取得 ->",
      apiLinkOpenCode: "OpenCode API Key を取得 ->",
      apiLinkVtrix: "Vtrix API Key を取得 ->"
    }
  };

  const providerOptionLabels = {
    en: {
      siliconflow: "SiliconFlow (recommended in China)",
      google: "Google Gemini",
      anthropic: "Claude (Anthropic)",
      openai: "OpenAI",
      opencode: "OpenCode Zen",
      vtrix: "Vtrix"
    },
    zh: {
      siliconflow: "硅基流动 SiliconFlow (国内推荐)",
      google: "Google Gemini",
      anthropic: "Claude (Anthropic)",
      openai: "OpenAI",
      opencode: "OpenCode Zen",
      vtrix: "Vtrix"
    },
    ja: {
      siliconflow: "SiliconFlow (中国向けおすすめ)",
      google: "Google Gemini",
      anthropic: "Claude (Anthropic)",
      openai: "OpenAI",
      opencode: "OpenCode Zen",
      vtrix: "Vtrix"
    }
  };

  const modelMap = {
    siliconflow: [
      { value: "THUDM/GLM-4.1V-9B-Thinking", label: "GLM-4.1V-9B Thinking (Free)" },
      { value: "Qwen/Qwen3-VL-8B-Instruct", label: "Qwen3-VL-8B (Budget)" },
      { value: "Qwen/Qwen3-VL-30B-A3B-Instruct", label: "Qwen3-VL-30B (Low cost)" },
      { value: "Qwen/Qwen3-VL-32B-Instruct", label: "Qwen3-VL-32B (Recommended)" },
      { value: "zai-org/GLM-4.6V", label: "GLM-4.6V" },
      { value: "Qwen/Qwen2.5-VL-72B-Instruct", label: "Qwen2.5-VL-72B (High quality)" }
    ],
    google: [
      { value: "gemini-3-flash", label: "Gemini 3 Flash (Recommended)" },
      { value: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
      { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
      { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
      { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
      { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" }
    ],
    anthropic: [
      { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
      { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
      { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku (Fast)" }
    ],
    openai: [
      { value: "gpt-4o", label: "GPT-4o" },
      { value: "gpt-4o-mini", label: "GPT-4o Mini" }
    ],
    opencode: [
      { value: "anthropic/claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
      { value: "anthropic/claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
      { value: "openai/gpt-4o", label: "GPT-4o" },
      { value: "google/gemini-2.0-flash", label: "Gemini 2.0 Flash" }
    ],
    vtrix: [
      { value: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro Preview" },
      { value: "vtrix-gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
      { value: "vtrix-gemini-2.5-pro", label: "Gemini 2.5 Pro" },
      { value: "vtrix-gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { value: "vtrix-claude-opus-4.5", label: "Claude Opus 4.5" },
      { value: "vtrix-claude-sonnet-4.5", label: "Claude Sonnet 4.5" },
      { value: "vtrix-gpt-5-2", label: "GPT-5.2" },
      { value: "vtrix-gpt-5", label: "GPT-5" },
      { value: "vtrix-gpt-4o", label: "GPT-4o" },
      { value: "vtrix-gpt-4-1", label: "GPT-4.1" },
      { value: "vtrix-openai-o3", label: "OpenAI o3" }
    ]
  };

  const providerMetaMap = {
    siliconflow: {
      label: {
        en: "SiliconFlow API Key",
        zh: "硅基流动 API Key",
        ja: "SiliconFlow API キー"
      },
      placeholder: "sk-...",
      link: "https://cloud.siliconflow.cn/account/ak",
      linkTextKey: "apiLinkSiliconflow"
    },
    google: {
      label: {
        en: "Google API Key",
        zh: "Google API Key",
        ja: "Google API キー"
      },
      placeholder: "AIzaSy...",
      link: "https://aistudio.google.com/apikey",
      linkTextKey: "apiLinkGoogle"
    },
    anthropic: {
      label: {
        en: "Anthropic API Key",
        zh: "Anthropic API Key",
        ja: "Anthropic API キー"
      },
      placeholder: "sk-ant-...",
      link: "https://console.anthropic.com/settings/keys",
      linkTextKey: "apiLinkAnthropic"
    },
    openai: {
      label: {
        en: "OpenAI API Key",
        zh: "OpenAI API Key",
        ja: "OpenAI API キー"
      },
      placeholder: "sk-proj-...",
      link: "https://platform.openai.com/api-keys",
      linkTextKey: "apiLinkOpenAI"
    },
    opencode: {
      label: {
        en: "OpenCode API Key",
        zh: "OpenCode API Key",
        ja: "OpenCode API キー"
      },
      placeholder: "Enter your OpenCode key",
      link: "https://opencode.ai/workspace",
      linkTextKey: "apiLinkOpenCode"
    },
    vtrix: {
      label: {
        en: "Vtrix API Key",
        zh: "Vtrix API Key",
        ja: "Vtrix API キー"
      },
      placeholder: "Enter your Vtrix key",
      link: "https://vtrix.ai/settings?tab=api-keys",
      linkTextKey: "apiLinkVtrix"
    }
  };

  const promptConfigMap = {
    en: {
      systemPrompt: [
        "You are a professional image analysis and prompt generation assistant.",
        "The user will provide an image. You need to:",
        "1. Carefully analyze the subject, style, color palette, composition, and lighting",
        "2. Generate a detailed English prompt for AI art tools such as Midjourney, Stable Diffusion, and DALL-E",
        "3. Also provide a concise English summary",
        "",
        "Output format:",
        "[Summary]",
        "(brief English description)",
        "",
        "[English Prompt]",
        "(detailed English prompt including subject, style, tone, lighting, and composition)"
      ].join("\n"),
      userPrompt: "Please analyze this image and generate an AI art prompt."
    },
    zh: {
      systemPrompt: [
        "你是一个专业的图片分析与提示词生成助手。",
        "用户会给你一张图片，你需要：",
        "1. 仔细分析图片中的内容、风格、色彩、构图、光影等元素",
        "2. 生成一段详细的、可用于 AI 绘画（如 Midjourney、Stable Diffusion、DALL-E）的英文提示词",
        "3. 同时提供一段中文描述摘要",
        "",
        "输出格式：",
        "【中文描述】",
        "（简要中文描述）",
        "",
        "【English Prompt】",
        "（详细英文提示词，包含主体、风格、色调、光影、构图等）"
      ].join("\n"),
      userPrompt: "请分析这张图片并生成 AI 绘画提示词。"
    },
    ja: {
      systemPrompt: [
        "あなたは画像分析とプロンプト生成の専門アシスタントです。",
        "ユーザーは画像を1枚提供します。あなたの役割は次のとおりです。",
        "1. 画像内の被写体、スタイル、色彩、構図、ライティングを丁寧に分析する",
        "2. Midjourney、Stable Diffusion、DALL-E などで使える詳細な英語プロンプトを生成する",
        "3. さらに簡潔な日本語要約も提供する",
        "",
        "出力形式:",
        "【日本語の説明】",
        "（簡潔な日本語の説明）",
        "",
        "【English Prompt】",
        "（被写体、スタイル、色調、光、構図を含む詳細な英語プロンプト）"
      ].join("\n"),
      userPrompt: "この画像を分析して、AI 描画用のプロンプトを生成してください。"
    }
  };

  function normalizeLanguage(language) {
    if (!language) return "en";
    const normalized = language.toLowerCase();
    if (normalized.startsWith("zh")) return "zh";
    if (normalized.startsWith("ja")) return "ja";
    return "en";
  }

  function getStoredLanguage() {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY);
    } catch (_) {
      return null;
    }
  }

  function getCurrentLanguage() {
    return normalizeLanguage(
      getStoredLanguage() ||
      (navigator.languages && navigator.languages[0]) ||
      navigator.language ||
      "en"
    );
  }

  function setCurrentLanguage(language) {
    const normalized = normalizeLanguage(language);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
    } catch (_) {
      // Ignore storage write errors.
    }
    return normalized;
  }

  function format(template, variables) {
    return template.replace(/\{(\w+)\}/g, (_, key) => {
      return Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : `{${key}}`;
    });
  }

  function t(language, key, variables = {}) {
    const template = messages[language]?.[key] || messages.en[key] || key;
    return format(template, variables);
  }

  function applyTranslations(language, root = document) {
    const htmlLanguage = HTML_LANGUAGE_MAP[language] || "en";
    root.documentElement.lang = htmlLanguage;

    const titleKey = root.body?.dataset.pageTitleKey;
    if (titleKey) {
      root.title = t(language, titleKey);
    }

    root.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(language, element.dataset.i18n);
    });

    root.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(language, element.dataset.i18nPlaceholder);
    });

    root.querySelectorAll("[data-i18n-title]").forEach((element) => {
      element.title = t(language, element.dataset.i18nTitle);
    });

    root.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", t(language, element.dataset.i18nAriaLabel));
    });

    root.querySelectorAll("[data-i18n-alt]").forEach((element) => {
      element.alt = t(language, element.dataset.i18nAlt);
    });
  }

  function getProviderOptions(language) {
    return Object.entries(providerOptionLabels[language] || providerOptionLabels.en).map(([value, label]) => ({
      value,
      label
    }));
  }

  function getProviderDisplayName(language, provider) {
    return providerOptionLabels[language]?.[provider] || providerOptionLabels.en[provider] || provider;
  }

  function getProviderMeta(language) {
    const result = {};
    for (const [provider, meta] of Object.entries(providerMetaMap)) {
      result[provider] = {
        label: meta.label[language] || meta.label.en,
        placeholder: meta.placeholder,
        link: meta.link,
        linkText: t(language, meta.linkTextKey)
      };
    }
    return result;
  }

  function getModels() {
    return modelMap;
  }

  function getPromptConfig(language) {
    return promptConfigMap[language] || promptConfigMap.en;
  }

  global.ImagePromptI18n = {
    SUPPORTED_LANGUAGES,
    getCurrentLanguage,
    setCurrentLanguage,
    applyTranslations,
    t,
    getProviderOptions,
    getProviderDisplayName,
    getProviderMeta,
    getModels,
    getPromptConfig
  };
})(window);
