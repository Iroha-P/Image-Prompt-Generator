document.addEventListener("DOMContentLoaded", () => {
  const i18n = window.ImagePromptI18n;
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
  const btnFullscreen = document.getElementById("btn-fullscreen");
  const languageSelect = document.getElementById("language-select");

  let currentLang = i18n.getCurrentLanguage();

  initialize();

  function initialize() {
    languageSelect.value = currentLang;
    applyLanguage();
    loadSettings();
    loadSelectedImage();
  }

  function applyLanguage() {
    const selectedProvider = providerSelect.value || "siliconflow";
    const selectedModel = modelSelect.value || "";

    i18n.applyTranslations(currentLang, document);
    updateProviderOptions(selectedProvider);
    updateProviderUI(selectedProvider, selectedModel);
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
    const meta = i18n.getProviderMeta(currentLang)[provider];
    const models = i18n.getModels()[provider];

    apiKeyLabel.textContent = meta.label;
    apiKeyInput.placeholder = meta.placeholder;
    apiKeyLink.href = meta.link;
    apiKeyLink.textContent = meta.linkText;

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
    chrome.storage.local.get(["provider", "apiKey", "model"], (data) => {
      const provider = data.provider || "siliconflow";
      updateProviderOptions(provider);
      updateProviderUI(provider, data.model || "");

      if (data.apiKey) {
        apiKeyInput.value = data.apiKey;
      }
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

  languageSelect.addEventListener("change", () => {
    currentLang = i18n.setCurrentLanguage(languageSelect.value);
    applyLanguage();
  });

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
      showToast(i18n.t(currentLang, "toastEnterApiKey"));
      return;
    }

    chrome.storage.local.set({ provider, apiKey, model }, () => {
      showToast(i18n.t(currentLang, "toastSettingsSaved"));
      settingsPanel.classList.add("hidden");
    });
  });

  btnGenerate.addEventListener("click", handleGenerate);
  btnCopy.addEventListener("click", handleCopy);

  async function handleGenerate() {
    const imageUrl = previewImg.src;
    if (!imageUrl) {
      return;
    }

    setLoading(true);

    try {
      const response = await chrome.runtime.sendMessage({
        action: "generatePrompt",
        imageUrl,
        lang: currentLang
      });

      if (response.success) {
        promptText.textContent = response.data;
      } else {
        promptText.textContent = i18n.t(currentLang, "resultFailed", { message: response.error });
      }
      promptOutput.classList.remove("hidden");
    } catch (error) {
      promptText.textContent = i18n.t(currentLang, "resultFailed", { message: error.message });
      promptOutput.classList.remove("hidden");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    const text = promptText.textContent;
    if (!text) {
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      showToast(i18n.t(currentLang, "toastCopied"));
    });
  }

  function setLoading(loading) {
    btnGenerate.disabled = loading;
    btnGenerate.querySelector(".btn-text").classList.toggle("hidden", loading);
    btnGenerate.querySelector(".btn-loading").classList.toggle("hidden", !loading);
  }

  function showToast(message) {
    toast.textContent = message || i18n.t(currentLang, "toastCopied");
    toast.classList.remove("hidden");
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 300);
    }, 1500);
  }
});
