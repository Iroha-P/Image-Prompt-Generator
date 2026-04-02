const LANGUAGE_MAP = {
  zh: "zh",
  ja: "ja",
  en: "en"
};

function normalizeLanguage(language) {
  if (!language) {
    return "en";
  }
  const normalized = language.toLowerCase();
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("ja")) return "ja";
  return "en";
}

function getText(language, key, variables = {}) {
  const messages = {
    en: {
      contextMenuTitle: "Recognize image and generate prompt",
      noApiKeyConfigured: "API key is not configured. Please enter it in Settings.",
      errorCannotAccessImageUrl: "Cannot access the image URL. This may be caused by a CORS restriction.",
      errorImageDownloadHttp: "Image download failed (HTTP {status})",
      errorConnectProvider: "Unable to connect to {provider} API. Please check your network connection. ({message})",
      errorApiRequestFailed: "{provider} API request failed ({status})",
      errorCheck403: "\n\nPlease check: 1) your API key 2) account verification status 3) whether the selected model is available"
    },
    zh: {
      contextMenuTitle: "识别图片并生成提示词",
      noApiKeyConfigured: "未配置 API Key，请在设置中填写",
      errorCannotAccessImageUrl: "无法访问图片地址，可能存在跨域限制",
      errorImageDownloadHttp: "图片下载失败 (HTTP {status})",
      errorConnectProvider: "无法连接 {provider} API。请检查网络连接。({message})",
      errorApiRequestFailed: "{provider} API 请求失败 ({status})",
      errorCheck403: "\n\n请检查: 1) API Key 是否正确 2) 账户是否已完成实名认证 3) 所选模型是否可用"
    },
    ja: {
      contextMenuTitle: "画像を認識してプロンプトを生成",
      noApiKeyConfigured: "API キーが未設定です。設定画面で入力してください。",
      errorCannotAccessImageUrl: "画像 URL にアクセスできません。CORS 制限の可能性があります。",
      errorImageDownloadHttp: "画像のダウンロードに失敗しました (HTTP {status})",
      errorConnectProvider: "{provider} API に接続できません。ネットワーク接続を確認してください。({message})",
      errorApiRequestFailed: "{provider} API リクエスト失敗 ({status})",
      errorCheck403: "\n\n確認してください: 1) API キー 2) アカウント認証状況 3) 選択モデルが利用可能か"
    }
  };

  const template = messages[language]?.[key] || messages.en[key] || key;
  return template.replace(/\{(\w+)\}/g, (_, name) => {
    return Object.prototype.hasOwnProperty.call(variables, name) ? variables[name] : `{${name}}`;
  });
}

function getPromptConfig(language) {
  const prompts = {
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

  return prompts[language] || prompts.en;
}

function setupContextMenu() {
  const uiLanguage = normalizeLanguage(chrome.i18n.getUILanguage());
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "recognize-image",
      title: getText(uiLanguage, "contextMenuTitle"),
      contexts: ["image"]
    });
  });
}

// ---- Context Menu ----

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.runtime.onStartup.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "recognize-image") {
    chrome.storage.local.set({
      selectedImage: {
        srcUrl: info.srcUrl,
        pageUrl: info.pageUrl,
        timestamp: Date.now()
      }
    }, () => {
      chrome.action.openPopup();
    });
  }
});

// ---- Message Handler ----

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "generatePrompt") {
    handleGeneratePrompt(message.imageUrl, normalizeLanguage(message.lang))
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
});

async function handleGeneratePrompt(imageUrl, language) {
  const data = await chrome.storage.local.get(["provider", "apiKey", "model"]);
  const provider = data.provider || "siliconflow";
  const apiKey = data.apiKey || "";
  const model = data.model || "THUDM/GLM-4.1V-9B-Thinking";
  const promptConfig = getPromptConfig(language);

  if (!apiKey) throw new Error(getText(language, "noApiKeyConfigured"));

  if (provider === "siliconflow") {
    return await callSiliconFlow(imageUrl, apiKey, model, promptConfig, language);
  } else if (provider === "google") {
    return await callGemini(imageUrl, apiKey, model, promptConfig, language);
  } else if (provider === "anthropic") {
    return await callClaude(imageUrl, apiKey, model, promptConfig, language);
  } else if (provider === "opencode") {
    return await callOpenCode(imageUrl, apiKey, model, promptConfig, language);
  } else if (provider === "vtrix") {
    return await callVtrix(imageUrl, apiKey, model, promptConfig, language);
  } else {
    return await callOpenAI(imageUrl, apiKey, model, promptConfig, language);
  }
}

// ---- 硅基流动 SiliconFlow API (OpenAI-compatible) ----

async function callSiliconFlow(imageUrl, apiKey, model, promptConfig, language) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl, language);
  const dataUrl = `data:${mimeType};base64,${base64}`;

  let response;
  try {
    response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
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
    });
  } catch (e) {
    throw new Error(getText(language, "errorConnectProvider", {
      provider: "SiliconFlow",
      message: e.message
    }));
  }

  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    let msg = getText(language, "errorApiRequestFailed", {
      provider: "SiliconFlow",
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
      msg += getText(language, "errorCheck403");
    }
    throw new Error(msg);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ---- Google Gemini API ----

async function fetchImageAsBase64(imageUrl, language) {
  let resp;
  try {
    resp = await fetch(imageUrl);
  } catch (e) {
    throw new Error(getText(language, "errorCannotAccessImageUrl"));
  }
  if (!resp.ok) throw new Error(getText(language, "errorImageDownloadHttp", { status: resp.status }));

  const blob = await resp.blob();
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  const mimeType = blob.type || "image/jpeg";
  return { base64, mimeType };
}

async function callGemini(imageUrl, apiKey, model, promptConfig, language) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl, language);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: promptConfig.systemPrompt }]
        },
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: promptConfig.userPrompt }
          ]
        }],
        generationConfig: { maxOutputTokens: 1000 }
      })
    });
  } catch (e) {
    throw new Error(
      getText(language, "errorConnectProvider", {
        provider: "Google",
        message: e.message
      })
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || getText(language, "errorApiRequestFailed", {
      provider: "Google",
      status: response.status
    }));
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ---- Anthropic Claude API ----

async function callClaude(imageUrl, apiKey, model, promptConfig, language) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl, language);

  let response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
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
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: base64
              }
            },
            {
              type: "text",
              text: promptConfig.userPrompt
            }
          ]
        }]
      })
    });
  } catch (e) {
    throw new Error(
      getText(language, "errorConnectProvider", {
        provider: "Anthropic",
        message: e.message
      })
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || getText(language, "errorApiRequestFailed", {
      provider: "Anthropic",
      status: response.status
    }));
  }

  const data = await response.json();
  return data.content[0].text;
}

// ---- OpenCode Zen API (OpenAI-compatible) ----

async function callOpenCode(imageUrl, apiKey, model, promptConfig, language) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl, language);
  const dataUrl = `data:${mimeType};base64,${base64}`;

  let response;
  try {
    response = await fetch("https://opencode.ai/zen/v1/chat/completions", {
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
    });
  } catch (e) {
    throw new Error(
      getText(language, "errorConnectProvider", {
        provider: "OpenCode",
        message: e.message
      })
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || getText(language, "errorApiRequestFailed", {
      provider: "OpenCode",
      status: response.status
    }));
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ---- Vtrix API ----

async function callVtrix(imageUrl, apiKey, model, promptConfig, language) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl, language);
  const dataUrl = `data:${mimeType};base64,${base64}`;

  let response;
  try {
    response = await fetch("https://cloud.vtrix.ai/llm/chat/completions", {
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
    });
  } catch (e) {
    throw new Error(getText(language, "errorConnectProvider", {
      provider: "Vtrix",
      message: e.message
    }));
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || getText(language, "errorApiRequestFailed", {
      provider: "Vtrix",
      status: response.status
    }));
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ---- OpenAI API ----

async function callOpenAI(imageUrl, apiKey, model, promptConfig, language) {
  let response;
  try {
    response = await fetch("https://api.openai.com/v1/chat/completions", {
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
              { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
              { type: "text", text: promptConfig.userPrompt }
            ]
          }
        ],
        max_tokens: 1000
      })
    });
  } catch (e) {
    throw new Error(
      getText(language, "errorConnectProvider", {
        provider: "OpenAI",
        message: e.message
      })
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || getText(language, "errorApiRequestFailed", {
      provider: "OpenAI",
      status: response.status
    }));
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
