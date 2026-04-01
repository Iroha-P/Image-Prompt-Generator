document.addEventListener("DOMContentLoaded", () => {
  const emptyState = document.getElementById("empty-state");
  const resultSection = document.getElementById("result-section");
  const previewImg = document.getElementById("preview-img");
  const btnGenerate = document.getElementById("btn-generate");
  const btnCopy = document.getElementById("btn-copy");
  const promptOutput = document.getElementById("prompt-output");
  const promptText = document.getElementById("prompt-text");
  const toast = document.getElementById("toast");

  const btnSettings = document.getElementById("btn-settings");
  const settingsPanel = document.getElementById("settings-panel");
  const providerSelect = document.getElementById("provider-select");
  const apiKeyInput = document.getElementById("api-key-input");
  const apiKeyLabel = document.getElementById("api-key-label");
  const apiKeyLink = document.getElementById("api-key-link");
  const btnToggleKey = document.getElementById("btn-toggle-key");
  const modelSelect = document.getElementById("model-select");
  const btnSaveSettings = document.getElementById("btn-save-settings");

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

  const btnFullscreen = document.getElementById("btn-fullscreen");

  loadSettings();
  loadSelectedImage();

  btnFullscreen.addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
    window.close();
  });

  providerSelect.addEventListener("change", () => {
    updateProviderUI(providerSelect.value);
  });

  btnSettings.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
  });

  btnToggleKey.addEventListener("click", () => {
    const isPassword = apiKeyInput.type === "password";
    apiKeyInput.type = isPassword ? "text" : "password";
    btnToggleKey.textContent = isPassword ? "🙈" : "👁️";
  });

  btnSaveSettings.addEventListener("click", () => {
    const provider = providerSelect.value;
    const apiKey = apiKeyInput.value.trim();
    const model = modelSelect.value;

    if (!apiKey) {
      showToast("请输入 API Key");
      return;
    }

    chrome.storage.local.set({ provider, apiKey, model }, () => {
      showToast("设置已保存");
      settingsPanel.classList.add("hidden");
    });
  });

  btnGenerate.addEventListener("click", handleGenerate);
  btnCopy.addEventListener("click", handleCopy);

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
    chrome.storage.local.get(["provider", "apiKey", "model"], (data) => {
      const provider = data.provider || "siliconflow";
      providerSelect.value = provider;
      updateProviderUI(provider);
      if (data.apiKey) apiKeyInput.value = data.apiKey;
      if (data.model) modelSelect.value = data.model;
    });
  }

  function loadSelectedImage() {
    chrome.storage.local.get("selectedImage", (data) => {
      if (data.selectedImage && data.selectedImage.srcUrl) {
        showImage(data.selectedImage.srcUrl);
      }
    });
  }

  function showImage(srcUrl) {
    previewImg.src = srcUrl;
    emptyState.classList.add("hidden");
    resultSection.classList.remove("hidden");
    promptOutput.classList.add("hidden");
  }

  async function handleGenerate() {
    const imageUrl = previewImg.src;
    if (!imageUrl) return;

    setLoading(true);

    try {
      const response = await chrome.runtime.sendMessage({
        action: "generatePrompt",
        imageUrl: imageUrl
      });

      if (response.success) {
        promptText.textContent = response.data;
      } else {
        promptText.textContent = `生成失败: ${response.error}`;
      }
      promptOutput.classList.remove("hidden");
    } catch (err) {
      promptText.textContent = `生成失败: ${err.message}`;
      promptOutput.classList.remove("hidden");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    const text = promptText.textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      showToast("已复制到剪贴板");
    });
  }

  function setLoading(loading) {
    btnGenerate.disabled = loading;
    btnGenerate.querySelector(".btn-text").classList.toggle("hidden", loading);
    btnGenerate.querySelector(".btn-loading").classList.toggle("hidden", !loading);
  }

  function showToast(message) {
    toast.textContent = message || "已复制到剪贴板";
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 1500);
  }
});
