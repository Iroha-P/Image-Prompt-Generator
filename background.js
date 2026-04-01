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

// ---- Context Menu ----

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "recognize-image",
    title: "识别图片并生成提示词",
    contexts: ["image"]
  });
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
    handleGeneratePrompt(message.imageUrl)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((err) => sendResponse({ success: false, error: err.message }));
    return true;
  }
});

async function handleGeneratePrompt(imageUrl) {
  const data = await chrome.storage.local.get(["provider", "apiKey", "model"]);
  const provider = data.provider || "siliconflow";
  const apiKey = data.apiKey || "";
  const model = data.model || "THUDM/GLM-4.1V-9B-Thinking";

  if (!apiKey) throw new Error("未配置 API Key，请在设置中填写");

  if (provider === "siliconflow") {
    return await callSiliconFlow(imageUrl, apiKey, model);
  } else if (provider === "google") {
    return await callGemini(imageUrl, apiKey, model);
  } else if (provider === "anthropic") {
    return await callClaude(imageUrl, apiKey, model);
  } else if (provider === "opencode") {
    return await callOpenCode(imageUrl, apiKey, model);
  } else if (provider === "vtrix") {
    return await callVtrix(imageUrl, apiKey, model);
  } else {
    return await callOpenAI(imageUrl, apiKey, model);
  }
}

// ---- 硅基流动 SiliconFlow API (OpenAI-compatible) ----

async function callSiliconFlow(imageUrl, apiKey, model) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl);
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
    });
  } catch (e) {
    throw new Error(`无法连接硅基流动 API。请检查网络连接。(${e.message})`);
  }

  if (!response.ok) {
    const raw = await response.text().catch(() => "");
    let msg = `硅基流动 API 请求失败 (${response.status})`;
    try {
      const err = JSON.parse(raw);
      if (err.error?.message) msg = err.error.message;
      else if (err.message) msg = err.message;
    } catch (_) {
      if (raw) msg += `: ${raw.slice(0, 200)}`;
    }
    if (response.status === 403) {
      msg += "\n\n请检查: 1) API Key 是否正确 2) 账户是否已完成实名认证 3) 所选模型是否在你的套餐内可用";
    }
    throw new Error(msg);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ---- Google Gemini API ----

async function fetchImageAsBase64(imageUrl) {
  let resp;
  try {
    resp = await fetch(imageUrl);
  } catch (e) {
    throw new Error(`图片下载失败: 无法访问图片地址。${e.message}`);
  }
  if (!resp.ok) throw new Error(`图片下载失败 (HTTP ${resp.status})`);

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

async function callGemini(imageUrl, apiKey, model) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        contents: [{
          parts: [
            { inline_data: { mime_type: mimeType, data: base64 } },
            { text: "请分析这张图片并生成 AI 绘画提示词。" }
          ]
        }],
        generationConfig: { maxOutputTokens: 1000 }
      })
    });
  } catch (e) {
    throw new Error(
      `无法连接 Google API。请检查网络连接或是否需要开启代理/VPN。(${e.message})`
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Google API 请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

// ---- Anthropic Claude API ----

async function callClaude(imageUrl, apiKey, model) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl);

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
        system: SYSTEM_PROMPT,
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
              text: "请分析这张图片并生成 AI 绘画提示词。"
            }
          ]
        }]
      })
    });
  } catch (e) {
    throw new Error(
      `无法连接 Anthropic API。请检查网络连接或是否需要开启代理/VPN。(${e.message})`
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Claude API 请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// ---- OpenCode Zen API (OpenAI-compatible) ----

async function callOpenCode(imageUrl, apiKey, model) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl);
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
    });
  } catch (e) {
    throw new Error(
      `无法连接 OpenCode API。请检查网络连接。(${e.message})`
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenCode API 请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ---- Vtrix API ----

async function callVtrix(imageUrl, apiKey, model) {
  const { base64, mimeType } = await fetchImageAsBase64(imageUrl);
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
    });
  } catch (e) {
    throw new Error(`无法连接 Vtrix API。请检查网络连接。(${e.message})`);
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `Vtrix API 请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ---- OpenAI API ----

async function callOpenAI(imageUrl, apiKey, model) {
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
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "image_url", image_url: { url: imageUrl, detail: "high" } },
              { type: "text", text: "请分析这张图片并生成 AI 绘画提示词。" }
            ]
          }
        ],
        max_tokens: 1000
      })
    });
  } catch (e) {
    throw new Error(
      `无法连接 OpenAI API。请检查网络连接或是否需要开启代理/VPN。(${e.message})`
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API 请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
