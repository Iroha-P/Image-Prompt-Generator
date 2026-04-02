document.addEventListener("DOMContentLoaded", () => {
  const i18n = window.ImagePromptI18n;
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
  const languageSelect = $("#language-select");

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

  let currentLang = i18n.getCurrentLanguage();
  let currentImageBase64 = null;
  let currentImageMimeType = null;

  initialize();

  function initialize() {
    languageSelect.value = currentLang;
    applyLanguage();
    loadSettings();
  }

  function applyLanguage() {
    const savedProvider = providerSelect.value || localStorage.getItem("ip_provider") || "siliconflow";
    const savedModel = modelSelect.value || localStorage.getItem("ip_model") || "";

    i18n.applyTranslations(currentLang, document);
    updateProviderOptions(savedProvider);
    updateProviderUI(savedProvider, savedModel);
    languageSelect.value = currentLang;
  }

  function updateProviderOptions(selectedProvider) {
    const options = i18n.getProviderOptions(currentLang);
    providerSelect.innerHTML = "";

    options.forEach((optionData) => {
      const option = document.createElement("option");
      option.value = optionData.value;
      option.textContent = optionData.label;
      providerSelect.appendChild(option);
    });

    providerSelect.value = selectedProvider;
  }

  function updateProviderUI(provider, selectedModel = "") {
    const providerMeta = i18n.getProviderMeta(currentLang)[provider];
    const models = i18n.getModels()[provider];

    apiKeyLabel.textContent = providerMeta.label;
    apiKeyInput.placeholder = providerMeta.placeholder;
    apiKeyLink.href = providerMeta.link;
    apiKeyLink.textContent = providerMeta.linkText;

    modelSelect.innerHTML = "";
    models.forEach((model) => {
      const option = document.createElement("option");
      option.value = model.value;
      option.textContent = model.label;
      modelSelect.appendChild(option);
    });

    modelSelect.value = models.some((model) => model.value === selectedModel)
      ? selectedModel
      : models[0].value;
  }

  function loadSettings() {
    const provider = localStorage.getItem("ip_provider") || "siliconflow";
    const apiKey = localStorage.getItem("ip_apiKey") || "";
    const model = localStorage.getItem("ip_model") || "";

    updateProviderOptions(provider);
    updateProviderUI(provider, model);

    if (apiKey) {
      apiKeyInput.value = apiKey;
    }
  }

  languageSelect.addEventListener("change", () => {
    currentLang = i18n.setCurrentLanguage(languageSelect.value);
    applyLanguage();
  });

  btnSettings.addEventListener("click", () => {
    settingsOverlay.classList.remove("hidden");
  });

  btnCloseSettings.addEventListener("click", closeSettings);

  settingsOverlay.addEventListener("click", (event) => {
    if (event.target === settingsOverlay) {
      closeSettings();
    }
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
      showToast(i18n.t(currentLang, "toastEnterApiKey"));
      return;
    }

    localStorage.setItem("ip_provider", provider);
    localStorage.setItem("ip_apiKey", apiKey);
    localStorage.setItem("ip_model", model);
    showToast(i18n.t(currentLang, "toastSettingsSaved"));
    closeSettings();
  });

  dropArea.addEventListener("click", () => fileInput.click());

  dropArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropArea.classList.add("drag-over");
  });

  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("drag-over");
  });

  dropArea.addEventListener("drop", (event) => {
    event.preventDefault();
    dropArea.classList.remove("drag-over");
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      loadImageFile(file);
    } else {
      showToast(i18n.t(currentLang, "toastDropImageFile"));
    }
  });

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      loadImageFile(file);
    }
  });

  btnLoadUrl.addEventListener("click", loadFromUrl);

  urlInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      loadFromUrl();
    }
  });

  function loadImageFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      currentImageBase64 = dataUrl.split(",")[1];
      currentImageMimeType = file.type || "image/jpeg";
      showPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function loadFromUrl() {
    const url = urlInput.value.trim();
    if (!url) {
      showToast(i18n.t(currentLang, "toastEnterImageUrl"));
      return;
    }

    try {
      showToast(i18n.t(currentLang, "toastLoadingImage"));
      const { base64, mimeType } = await fetchImageAsBase64(url, currentLang);
      currentImageBase64 = base64;
      currentImageMimeType = mimeType;
      showPreview(`data:${mimeType};base64,${base64}`);
    } catch (error) {
      showToast(i18n.t(currentLang, "toastImageLoadFailed", { message: error.message }));
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
    fileInput.value = "";
    urlInput.value = "";
  });

  btnGenerate.addEventListener("click", handleGenerate);

  async function handleGenerate() {
    if (!currentImageBase64) {
      showToast(i18n.t(currentLang, "toastSelectImageFirst"));
      return;
    }

    const provider = localStorage.getItem("ip_provider") || "siliconflow";
    const apiKey = localStorage.getItem("ip_apiKey") || "";
    const model = localStorage.getItem("ip_model") || i18n.getModels()[provider][0].value;

    if (!apiKey) {
      showToast(i18n.t(currentLang, "toastConfigApiKeyFirst"));
      settingsOverlay.classList.remove("hidden");
      return;
    }

    setLoading(true);

    try {
      const promptConfig = i18n.getPromptConfig(currentLang);
      const result = await callAPI(
        provider,
        apiKey,
        model,
        currentImageBase64,
        currentImageMimeType,
        promptConfig,
        currentLang
      );
      promptText.textContent = result;
      promptCard.classList.remove("hidden");
    } catch (error) {
      promptText.textContent = i18n.t(currentLang, "resultFailed", { message: error.message });
      promptCard.classList.remove("hidden");
    } finally {
      setLoading(false);
    }
  }

  btnCopy.addEventListener("click", () => {
    const text = promptText.textContent;
    if (!text) {
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      showToast(i18n.t(currentLang, "toastCopied"));
    });
  });

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

async function fetchImageAsBase64(imageUrl, language) {
  const i18n = window.ImagePromptI18n;
  let resp;
  try {
    resp = await fetch(imageUrl);
  } catch (e) {
    throw new Error(i18n.t(language, "errorCannotAccessImageUrl"));
  }
  if (!resp.ok) {
    throw new Error(i18n.t(language, "errorImageDownloadHttp", { status: resp.status }));
  }

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

async function callAPI(provider, apiKey, model, base64, mimeType, promptConfig, language) {
  switch (provider) {
    case "siliconflow": return callSiliconFlow(apiKey, model, base64, mimeType, promptConfig, language);
    case "google":      return callGemini(apiKey, model, base64, mimeType, promptConfig, language);
    case "anthropic":   return callClaude(apiKey, model, base64, mimeType, promptConfig, language);
    case "opencode":    return callOpenCode(apiKey, model, base64, mimeType, promptConfig, language);
    case "vtrix":       return callVtrix(apiKey, model, base64, mimeType, promptConfig, language);
    default:            return callOpenAI(apiKey, model, base64, mimeType, promptConfig, language);
  }
}

// ---- SiliconFlow API ----

async function callSiliconFlow(apiKey, model, base64, mimeType, promptConfig, language) {
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
        { role: "system", content: promptConfig.systemPrompt },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl } },
            { type: "text", text: promptConfig.userPrompt }
          ]
        }
      ],
      max_tokens: 1000
    })
  }, "SiliconFlow", language);

  return response.choices[0].message.content;
}

// ---- Google Gemini API ----

async function callGemini(apiKey, model, base64, mimeType, promptConfig, language) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: promptConfig.systemPrompt }] },
      contents: [{
        parts: [
          { inline_data: { mime_type: mimeType, data: base64 } },
          { text: promptConfig.userPrompt }
        ]
      }],
      generationConfig: { maxOutputTokens: 1000 }
    })
  }, "Google", language);

  return response.candidates[0].content.parts[0].text;
}

// ---- Anthropic Claude API ----

async function callClaude(apiKey, model, base64, mimeType, promptConfig, language) {
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
      system: promptConfig.systemPrompt,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
          { type: "text", text: promptConfig.userPrompt }
        ]
      }]
    })
  }, "Anthropic", language);

  return response.content[0].text;
}

// ---- OpenCode Zen API ----

async function callOpenCode(apiKey, model, base64, mimeType, promptConfig, language) {
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
        { role: "system", content: promptConfig.systemPrompt },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            { type: "text", text: promptConfig.userPrompt }
          ]
        }
      ],
      max_tokens: 1000
    })
  }, "OpenCode", language);

  return response.choices[0].message.content;
}

// ---- OpenAI API ----

async function callOpenAI(apiKey, model, base64, mimeType, promptConfig, language) {
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
        { role: "system", content: promptConfig.systemPrompt },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            { type: "text", text: promptConfig.userPrompt }
          ]
        }
      ],
      max_tokens: 1000
    })
  }, "OpenAI", language);

  return response.choices[0].message.content;
}

// ---- Vtrix API ----

async function callVtrix(apiKey, model, base64, mimeType, promptConfig, language) {
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
        { role: "system", content: promptConfig.systemPrompt },
        {
          role: "user",
          content: [
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
            { type: "text", text: promptConfig.userPrompt }
          ]
        }
      ],
      max_tokens: 1000
    })
  }, "Vtrix", language);

  return response.choices[0].message.content;
}

// ---- Shared Fetch Wrapper ----

async function apiFetch(url, options, providerName, language) {
  const i18n = window.ImagePromptI18n;
  let response;
  try {
    response = await fetch(url, options);
  } catch (e) {
    throw new Error(i18n.t(language, "errorConnectProvider", {
      provider: providerName,
      message: e.message
    }));
  }

  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    let msg = i18n.t(language, "errorApiRequestFailed", {
      provider: providerName,
      status: response.status
    });
    try {
      const err = JSON.parse(raw);
      if (err.error?.message) msg = err.error.message;
      else if (err.message) msg = err.message;
    } catch (_) {
      if (raw) msg += `: ${raw.slice(0, 200)}`;
    }
    if (response.status === 403) {
      msg += i18n.t(language, "errorCheck403");
    }
    throw new Error(msg);
  }

  return response.json();
}
