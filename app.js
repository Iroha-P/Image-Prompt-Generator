// ---- System Prompt ----

const SYSTEM_PROMPT = [
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
].join("\n");

// ---- Provider / Model Config ----

const MODELS = {
  siliconflow: [
    { value: "THUDM/GLM-4.1V-9B-Thinking", label: "GLM-4.1V-9B Thinking (免费)" },
    { value: "Qwen/Qwen3-VL-8B-Instruct", label: "Qwen3-VL-8B (极低价)" },
    { value: "Qwen/Qwen3-VL-30B-A3B-Instruct", label: "Qwen3-VL-30B (低价)" },
    { value: "Qwen/Qwen3-VL-32B-Instruct", label: "Qwen3-VL-32B (推荐)" },
    { value: "zai-org/GLM-4.6V", label: "GLM-4.6V" },
    { value: "Qwen/Qwen2.5-VL-72B-Instruct", label: "Qwen2.5-VL-72B (高质量)" }
  ],
  google: [
    { value: "gemini-3-flash", label: "Gemini 3 Flash (推荐)" },
    { value: "gemini-3.1-pro", label: "Gemini 3.1 Pro" },
    { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite" },
    { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
    { value: "gemini-2.0-flash-lite", label: "Gemini 2.0 Flash Lite" },
    { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" }
  ],
  anthropic: [
    { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
    { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
    { value: "claude-3-5-haiku-20241022", label: "Claude 3.5 Haiku (快速)" }
  ],
  openai: [
    { value: "gpt-4o", label: "GPT-4o" },
    { value: "gpt-4o-mini", label: "GPT-4o-mini" }
  ],
  opencode: [
    { value: "anthropic/claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
    { value: "anthropic/claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet" },
    { value: "openai/gpt-4o", label: "GPT-4o" },
    { value: "google/gemini-2.0-flash", label: "Gemini 2.0 Flash" }
  ],
  vtrix: [
    { value: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro Preview (多模态)" },
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

const PROVIDER_META = {
  siliconflow: {
    label: "硅基流动 API Key",
    placeholder: "sk-...",
    link: "https://cloud.siliconflow.cn/account/ak",
    linkText: "获取硅基流动 API Key →"
  },
  google: {
    label: "Google API Key",
    placeholder: "AIzaSy...",
    link: "https://aistudio.google.com/apikey",
    linkText: "获取 Google API Key →"
  },
  anthropic: {
    label: "Anthropic API Key",
    placeholder: "sk-ant-...",
    link: "https://console.anthropic.com/settings/keys",
    linkText: "获取 Claude API Key →"
  },
  openai: {
    label: "OpenAI API Key",
    placeholder: "sk-proj-...",
    link: "https://platform.openai.com/api-keys",
    linkText: "获取 OpenAI API Key →"
  },
  opencode: {
    label: "OpenCode API Key",
    placeholder: "输入你的 OpenCode Key",
    link: "https://opencode.ai/workspace",
    linkText: "获取 OpenCode API Key →"
  },
  vtrix: {
    label: "Vtrix API Key",
    placeholder: "输入你的 Vtrix Key",
    link: "https://vtrix.ai/settings?tab=api-keys",
    linkText: "获取 Vtrix API Key →"
  }
};

// ---- DOM Ready ----

document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel) => document.querySelector(sel);

  const uploadZone = $("#upload-zone");
  const dropArea = $("#drop-area");
  const fileInput = $("#file-input");
  const urlInput = $("#url-input");
  const btnLoadUrl = $("#btn-load-url");
  const resultSection = $("#result-section");
  const previewImg = $("#preview-img");
  const btnChangeImage = $("#btn-change-image");
  const btnGenerate = $("#btn-generate");
  const promptCard = $("#prompt-card");
  const promptText = $("#prompt-text");
  const btnCopy = $("#btn-copy");
  const toast = $("#toast");

  const btnSettings = $("#btn-settings");
  const settingsOverlay = $("#settings-overlay");
  const btnCloseSettings = $("#btn-close-settings");
  const providerSelect = $("#provider-select");
  const apiKeyInput = $("#api-key-input");
  const apiKeyLabel = $("#api-key-label");
  const apiKeyLink = $("#api-key-link");
  const btnToggleKey = $("#btn-toggle-key");
  const modelSelect = $("#model-select");
  const btnSaveSettings = $("#btn-save-settings");

  let currentImageBase64 = null;
  let currentImageMimeType = null;
  let currentImageUrl = null;

  loadSettings();

  // ---- Settings ----

  btnSettings.addEventListener("click", () => {
    settingsOverlay.classList.remove("hidden");
  });

  btnCloseSettings.addEventListener("click", closeSettings);

  settingsOverlay.addEventListener("click", (e) => {
    if (e.target === settingsOverlay) closeSettings();
  });

  function closeSettings() {
    settingsOverlay.classList.add("hidden");
  }

  providerSelect.addEventListener("change", () => {
    updateProviderUI(providerSelect.value);
  });

  btnToggleKey.addEventListener("click", () => {
    const isPassword = apiKeyInput.type === "password";
    apiKeyInput.type = isPassword ? "text" : "password";
  });

  btnSaveSettings.addEventListener("click", () => {
    const provider = providerSelect.value;
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;

    if (!apiKey) {
      showToast("请输入 API Key");
      return;
    }

    localStorage.setItem("ip_provider", provider);
    localStorage.setItem("ip_apiKey", apiKey);
    localStorage.setItem("ip_model", model);
    showToast("设置已保存");
    closeSettings();
  });

  function updateProviderUI(provider) {
    const meta = PROVIDER_META[provider];
    apiKeyLabel.textContent = meta.label;
    apiKeyInput.placeholder = meta.placeholder;
    apiKeyLink.href = meta.link;
    apiKeyLink.textContent = meta.linkText;

    modelSelect.innerHTML = "";
    for (const m of MODELS[provider]) {
      const opt = document.createElement("option");
      opt.value = m.value;
      opt.textContent = m.label;
      modelSelect.appendChild(opt);
    }
  }

  function loadSettings() {
    const provider = localStorage.getItem("ip_provider") || "siliconflow";
    const apiKey = localStorage.getItem("ip_apiKey") || "";
    const model = localStorage.getItem("ip_model") || "";

    providerSelect.value = provider;
    updateProviderUI(provider);
    if (apiKey) apiKeyInput.value = apiKey;
    if (model) modelSelect.value = model;
  }

  // ---- Image Upload ----

  dropArea.addEventListener("click", () => fileInput.click());

  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("drag-over");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("drag-over");
  });

  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      loadImageFile(file);
    } else {
      showToast("请拖入图片文件");
    }
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) loadImageFile(file);
  });

  btnLoadUrl.addEventListener("click", loadFromUrl);

  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") loadFromUrl();
  });

  function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(",")[1];
      const mimeType = file.type || "image/jpeg";
      currentImageBase64 = base64;
      currentImageMimeType = mimeType;
      currentImageUrl = null;
      showPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function loadFromUrl() {
    const url = urlInput.value.trim();
    if (!url) {
      showToast("请输入图片 URL");
      return;
    }

    try {
      showToast("正在加载图片...");
      const { base64, mimeType } = await fetchImageAsBase64(url);
      currentImageBase64 = base64;
      currentImageMimeType = mimeType;
      currentImageUrl = url;
      showPreview(`data:${mimeType};base64,${base64}`);
    } catch (err) {
      showToast("图片加载失败: " + err.message);
    }
  }

  function showPreview(src) {
    previewImg.src = src;
    uploadZone.classList.add("hidden");
    resultSection.classList.remove("hidden");
    promptCard.classList.add("hidden");
  }

  btnChangeImage.addEventListener("click", () => {
    resultSection.classList.add("hidden");
    uploadZone.classList.remove("hidden");
    currentImageBase64 = null;
    currentImageMimeType = null;
    currentImageUrl = null;
    fileInput.value = "";
    urlInput.value = "";
  });

  // ---- Generate ----

  btnGenerate.addEventListener("click", handleGenerate);

  async function handleGenerate() {
    if (!currentImageBase64) {
      showToast("请先选择一张图片");
      return;
    }

    const provider = localStorage.getItem("ip_provider") || "siliconflow";
    const apiKey = localStorage.getItem("ip_apiKey") || "";
    const model = localStorage.getItem("ip_model") || MODELS[provider][0].value;

    if (!apiKey) {
      showToast("请先在设置中配置 API Key");
      settingsOverlay.classList.remove("hidden");
      return;
    }

    setLoading(true);

    try {
      const result = await callAPI(provider, apiKey, model, currentImageBase64, currentImageMimeType);
      promptText.textContent = result;
      promptCard.classList.remove("hidden");
    } catch (err) {
      promptText.textContent = "生成失败: " + err.message;
      promptCard.classList.remove("hidden");
    } finally {
      setLoading(false);
    }
  }

  // ---- Copy ----

  btnCopy.addEventListener("click", () => {
    const text = promptText.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast("已复制到剪贴板");
    });
  });

  // ---- UI Helpers ----

  function setLoading(loading) {
    btnGenerate.disabled = loading;
    btnGenerate.querySelector(".btn-text").classList.toggle("hidden", loading);
    btnGenerate.querySelector(".btn-icon-svg").classList.toggle("hidden", loading);
    btnGenerate.querySelector(".btn-loading").classList.toggle("hidden", !loading);
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 2000);
  }
});

// ---- Image Fetching ----

async function fetchImageAsBase64(imageUrl) {
  let resp;
  try {
    resp = await fetch(imageUrl);
  } catch (e) {
    throw new Error("无法访问图片地址，可能存在跨域限制");
  }
  if (!resp.ok) throw new Error(`图片下载失败 (HTTP ${resp.status})`);

  const blob = await resp.blob();
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return { base64: btoa(binary), mimeType: blob.type || "image/jpeg" };
}

// ---- API Dispatcher ----

async function callAPI(provider, apiKey, model, base64, mimeType) {
  switch (provider) {
    case "siliconflow": return callSiliconFlow(apiKey, model, base64, mimeType);
    case "google":      return callGemini(apiKey, model, base64, mimeType);
    case "anthropic":   return callClaude(apiKey, model, base64, mimeType);
    case "opencode":    return callOpenCode(apiKey, model, base64, mimeType);
    case "vtrix":       return callVtrix(apiKey, model, base64, mimeType);
    default:            return callOpenAI(apiKey, model, base64, mimeType);
  }
}

// ---- SiliconFlow API ----

async function callSiliconFlow(apiKey, model, base64, mimeType) {
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const response = await apiFetch("https://api.siliconflow.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl } },
            { type: "text", text: "请分析这张图片并生成 AI 绘画提示词。" }
          ]
        }
      ],
      max_tokens: 1000
    })
  }, "硅基流动");

  return response.choices[0].message.content;
}

// ---- Google Gemini API ----

async function callGemini(apiKey, model, base64, mimeType) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{
        parts: [
          { inline_data: { mime_type: mimeType, data: base64 } },
          { text: "请分析这张图片并生成 AI 绘画提示词。" }
        ]
      }],
      generationConfig: { maxOutputTokens: 1000 }
    })
  }, "Google");

  return response.candidates[0].content.parts[0].text;
}

// ---- Anthropic Claude API ----

async function callClaude(apiKey, model, base64, mimeType) {
  const response = await apiFetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true"
    },
    body: JSON.stringify({
      model,
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
          { type: "text", text: "请分析这张图片并生成 AI 绘画提示词。" }
        ]
      }]
    })
  }, "Claude");

  return response.content[0].text;
}

// ---- OpenCode Zen API ----

async function callOpenCode(apiKey, model, base64, mimeType) {
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const response = await apiFetch("https://opencode.ai/zen/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            { type: "text", text: "请分析这张图片并生成 AI 绘画提示词。" }
          ]
        }
      ],
      max_tokens: 1000
    })
  }, "OpenCode");

  return response.choices[0].message.content;
}

// ---- OpenAI API ----

async function callOpenAI(apiKey, model, base64, mimeType) {
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const response = await apiFetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            { type: "text", text: "请分析这张图片并生成 AI 绘画提示词。" }
          ]
        }
      ],
      max_tokens: 1000
    })
  }, "OpenAI");

  return response.choices[0].message.content;
}

// ---- Vtrix API ----

async function callVtrix(apiKey, model, base64, mimeType) {
  const dataUrl = `data:${mimeType};base64,${base64}`;

  const response = await apiFetch("https://cloud.vtrix.ai/llm/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            { type: "text", text: "请分析这张图片并生成 AI 绘画提示词。" }
          ]
        }
      ],
      max_tokens: 1000
    })
  }, "Vtrix");

  return response.choices[0].message.content;
}

// ---- Shared Fetch Wrapper ----

async function apiFetch(url, options, providerName) {
  let response;
  try {
    response = await fetch(url, options);
  } catch (e) {
    throw new Error(`无法连接 ${providerName} API。请检查网络连接。(${e.message})`);
  }

  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    let msg = `${providerName} API 请求失败 (${response.status})`;
    try {
      const err = JSON.parse(raw);
      if (err.error?.message) msg = err.error.message;
      else if (err.message) msg = err.message;
    } catch (_) {
      if (raw) msg += `: ${raw.slice(0, 200)}`;
    }
    if (response.status === 403) {
      msg += "\n\n请检查: 1) API Key 是否正确 2) 账户是否已完成实名认证 3) 所选模型是否可用";
    }
    throw new Error(msg);
  }

  return response.json();
}
