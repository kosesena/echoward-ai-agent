const PRODUCTS = [
  {
    product_id: "P001",
    product_name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Electronics",
    price: 249.99,
    original_price: 279.99,
    seller_name: "SonyOfficialStore",
    seller_rating: 4.8,
    seller_review_count: 12500,
    product_rating: 4.7,
    product_review_count: 8900,
    is_verified_seller: true,
    seller_days_on_platform: 1825,
    return_policy: "30-day free return",
    platform: "Amazon"
  },
  {
    product_id: "P002",
    product_name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Electronics",
    price: 49.99,
    original_price: 279.99,
    seller_name: "BestDeals2024",
    seller_rating: 2.1,
    seller_review_count: 12,
    product_rating: 3.2,
    product_review_count: 8,
    is_verified_seller: false,
    seller_days_on_platform: 14,
    return_policy: "No returns",
    platform: "eBay"
  },
  {
    product_id: "P003",
    product_name: "Nike Air Max 270",
    category: "Footwear",
    price: 129.99,
    original_price: 150.0,
    seller_name: "NikeOfficial",
    seller_rating: 4.9,
    seller_review_count: 25000,
    product_rating: 4.6,
    product_review_count: 15000,
    is_verified_seller: true,
    seller_days_on_platform: 3650,
    return_policy: "60-day free return",
    platform: "Nike.com"
  },
  {
    product_id: "P004",
    product_name: "iPhone 15 Pro",
    category: "Electronics",
    price: 199.99,
    original_price: 999.99,
    seller_name: "TechSuper99",
    seller_rating: 1.8,
    seller_review_count: 5,
    product_rating: 2.5,
    product_review_count: 3,
    is_verified_seller: false,
    seller_days_on_platform: 7,
    return_policy: "No returns",
    platform: "eBay"
  },
  {
    product_id: "P005",
    product_name: "Samsung 65\" 4K Smart TV",
    category: "Electronics",
    price: 799.99,
    original_price: 899.99,
    seller_name: "SamsungStore",
    seller_rating: 4.7,
    seller_review_count: 9800,
    product_rating: 4.5,
    product_review_count: 6700,
    is_verified_seller: true,
    seller_days_on_platform: 2190,
    return_policy: "30-day free return",
    platform: "Amazon"
  },
  {
    product_id: "P006",
    product_name: "Rolex Submariner Watch",
    category: "Accessories",
    price: 299.99,
    original_price: 9500.0,
    seller_name: "LuxuryDealsShop",
    seller_rating: 2.3,
    seller_review_count: 18,
    product_rating: 2.8,
    product_review_count: 11,
    is_verified_seller: false,
    seller_days_on_platform: 21,
    return_policy: "No returns",
    platform: "Trendyol"
  }
];

const tokenEndpoint = "/api/copilot-token";
const directLineDomain = "https://europe.directline.botframework.com/v3/directline";
const speechKey = "758afc79580b488193eea71f5dd347e9";
const speechRegion = "swedencentral";
const speechVoice = "en-US-AriaNeural";

const productGrid = document.getElementById("product-grid");
const productCountEl = document.getElementById("product-count");
const verifiedCountEl = document.getElementById("verified-count");
const platformCountEl = document.getElementById("platform-count");
const chatModeButton = document.getElementById("chat-mode-button");
const voiceModeButton = document.getElementById("voice-mode-button");
const chatControls = document.getElementById("chat-controls");
const voiceControls = document.getElementById("voice-controls");
const statusEl = document.getElementById("status");
const messagesEl = document.getElementById("messages");
const quickActionsEl = document.getElementById("quick-actions");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");
const micButton = document.getElementById("mic-button");
const transcriptBox = document.getElementById("transcript-box");

let assistantMode = "chat";
let speechSynthesizer;
let directLine;
let conversationReady = false;
let isListening = false;

const quickPrompts = [
  "Which product looks safest here?",
  "Check the suspicious sellers for me.",
  "Compare only the verified sellers."
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatMembership(days) {
  if (days >= 365) {
    const years = Math.round(days / 365);
    return `Member for ${years} year${years === 1 ? "" : "s"}`;
  }

  if (days >= 30) {
    const months = Math.round(days / 30);
    return `Member for ${months} month${months === 1 ? "" : "s"}`;
  }

  return `Member for ${days} day${days === 1 ? "" : "s"}`;
}

function renderStars(value) {
  const fullStars = Math.round(value);
  return `${"&#9733;".repeat(fullStars)}${"&#9734;".repeat(5 - fullStars)}`;
}

function renderProducts(items) {
  productCountEl.textContent = formatNumber(items.length);
  verifiedCountEl.textContent = formatNumber(items.filter(item => item.is_verified_seller).length);
  platformCountEl.textContent = formatNumber(new Set(items.map(item => item.platform)).size);

  productGrid.innerHTML = items.map(item => `
    <article class="product-card">
      <div class="card-topline">
        <span class="label">${item.category}</span>
        <span class="tag">${item.platform}</span>
      </div>
      <h3>${item.product_name}</h3>
      <div>
        <div class="price-row">
          <span class="price">${formatCurrency(item.price)}</span>
          ${item.original_price > item.price ? `<span class="original-price">${formatCurrency(item.original_price)}</span>` : ""}
        </div>
        <div class="seller-line">Sold by <strong>${item.seller_name}</strong></div>
      </div>
      <div class="rating-row">
        <div class="rating-block">
          <span class="rating-label">Seller rating</span>
          <span class="stars">${renderStars(item.seller_rating)}<small>${item.seller_rating.toFixed(1)} | ${formatNumber(item.seller_review_count)} reviews</small></span>
        </div>
        <div class="rating-block">
          <span class="rating-label">Product rating</span>
          <span class="stars">${renderStars(item.product_rating)}<small>${item.product_rating.toFixed(1)} | ${formatNumber(item.product_review_count)} reviews</small></span>
        </div>
      </div>
      <div class="meta-row">
        <span class="badge ${item.is_verified_seller ? "verified" : "unverified"}">
          ${item.is_verified_seller ? "Verified" : "Unverified"}
        </span>
        <span class="detail-text">${formatMembership(item.seller_days_on_platform)}</span>
      </div>
      <div class="detail-text">Return policy: ${item.return_policy}</div>
    </article>
  `).join("");
}

function setAssistantMode(mode) {
  assistantMode = mode;
  const chatActive = mode === "chat";
  chatModeButton.classList.toggle("active", chatActive);
  voiceModeButton.classList.toggle("active", !chatActive);
  chatControls.classList.toggle("active", chatActive);
  voiceControls.classList.toggle("active", !chatActive);
}

function setStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = `status-bar ${type || ""}`.trim();
}

function describeError(error) {
  if (!error) {
    return "Unknown error.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function appendMessage(role, text) {
  const bubble = document.createElement("div");
  bubble.className = `message ${role}`;
  bubble.textContent = text;
  messagesEl.appendChild(bubble);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function getSpeechSynthesizer() {
  if (!speechKey || !speechRegion) {
    return null;
  }

  if (!speechSynthesizer) {
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechSynthesisVoiceName = speechVoice;
    speechSynthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig);
  }

  return speechSynthesizer;
}

function getSpeechConfig() {
  if (!speechKey || !speechRegion) {
    return null;
  }

  const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, speechRegion);
  speechConfig.speechRecognitionLanguage = "en-US";
  speechConfig.speechSynthesisVoiceName = speechVoice;
  return speechConfig;
}

function updateControlsState() {
  sendButton.disabled = !conversationReady || !chatInput.value.trim();
  micButton.disabled = !conversationReady || !getSpeechConfig();
  micButton.classList.toggle("listening", isListening);
}

async function speakText(text) {
  if (assistantMode !== "voice" || !text) {
    return;
  }

  const synthesizer = getSpeechSynthesizer();
  if (!synthesizer) {
    return;
  }

  await new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      () => resolve(),
      error => reject(error)
    );
  });
}

async function recognizeSpeechOnce() {
  if (!window.isSecureContext) {
    throw new Error("Microphone access requires HTTPS or localhost. Do not open this page with file://.");
  }

  const speechConfig = getSpeechConfig();
  if (!speechConfig) {
    throw new Error("Azure Speech key or region is missing.");
  }

  const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
  const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

  return new Promise((resolve, reject) => {
    recognizer.recognizeOnceAsync(
      result => {
        recognizer.close();

        if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech && result.text) {
          resolve(result.text);
          return;
        }

        if (result.reason === SpeechSDK.ResultReason.NoMatch) {
          reject(new Error("No speech was recognized."));
          return;
        }

        reject(new Error(result.errorDetails || "Speech recognition failed."));
      },
      error => {
        recognizer.close();
        reject(error);
      }
    );
  });
}

async function postMessageToBot(text) {
  if (!directLine) {
    throw new Error("Direct Line connection is not ready.");
  }

  appendMessage("user", text);

  await new Promise((resolve, reject) => {
    directLine.postActivity({
      type: "message",
      from: { id: "user", role: "user" },
      text
    }).subscribe({
      next: () => resolve(),
      error: reject
    });
  });
}

async function sendChatMessage(text) {
  const message = text.trim();
  if (!message || !conversationReady) {
    return;
  }

  chatInput.value = "";
  updateControlsState();
  setStatus("EchoWard is reviewing your request...", "warn");

  try {
    await postMessageToBot(message);
  } catch (error) {
    console.error(error);
    setStatus(`Message failed: ${describeError(error)}`, "error");
  }
}

async function startListening() {
  if (isListening || !conversationReady) {
    return;
  }

  isListening = true;
  updateControlsState();
  transcriptBox.textContent = "Listening for your voice...";
  setStatus("Listening for your voice...", "ok");

  try {
    const transcript = await recognizeSpeechOnce();
    transcriptBox.textContent = transcript;
    await postMessageToBot(transcript);
  } catch (error) {
    console.error(error);
    transcriptBox.textContent = "Voice capture did not complete.";
    setStatus(`Speech input failed: ${describeError(error)}`, "error");
  } finally {
    isListening = false;
    updateControlsState();
  }
}

async function fetchDirectLineToken() {
  const response = await fetch(tokenEndpoint);

  let payload;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const details = payload && (payload.details || payload.error);
    throw new Error(`Token endpoint returned ${response.status}${details ? `: ${details}` : ""}`);
  }

  if (!payload.token) {
    throw new Error("Token response did not include a Direct Line token.");
  }

  return payload.token;
}

async function connectAssistant() {
  setStatus("Connecting to EchoWard...", "warn");

  try {
    const token = await fetchDirectLineToken();
    directLine = window.WebChat.createDirectLine({
      token,
      domain: directLineDomain
    });

    directLine.connectionStatus$.subscribe(status => {
      if (status === 1) {
        setStatus("Connecting to EchoWard...", "warn");
        return;
      }

      if (status === 2) {
        conversationReady = true;
        updateControlsState();
        setStatus("Connected. Ask EchoWard about any product on the left.", "ok");
        return;
      }

      if (status === 3) {
        conversationReady = false;
        updateControlsState();
        setStatus("EchoWard token expired. Refresh the page to reconnect.", "error");
        return;
      }

      if (status === 4) {
        conversationReady = false;
        updateControlsState();
        setStatus("EchoWard failed to connect. Check publish status, authentication mode, and web channel security.", "error");
        return;
      }

      if (status === 5) {
        conversationReady = false;
        updateControlsState();
        setStatus("EchoWard conversation ended.", "warn");
      }
    });

    directLine.activity$.subscribe(async activity => {
      if (activity.type !== "message" || !activity.text) {
        return;
      }

      if (activity.from && activity.from.role === "user") {
        return;
      }

      appendMessage("bot", activity.text);
      setStatus("EchoWard replied.", "ok");

      try {
        await speakText(activity.text);
      } catch (error) {
        console.error(error);
        setStatus(`Voice playback failed: ${describeError(error)}`, "error");
      }
    });
  } catch (error) {
    console.error(error);
    conversationReady = false;
    updateControlsState();
    setStatus(`Connection failed: ${describeError(error)}`, "error");
  }
}

function renderQuickActions() {
  quickActionsEl.innerHTML = "";

  quickPrompts.forEach(prompt => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-action";
    button.textContent = prompt;
    button.addEventListener("click", () => {
      chatInput.value = prompt;
      updateControlsState();
      sendChatMessage(prompt);
    });
    quickActionsEl.appendChild(button);
  });
}

renderProducts(PRODUCTS);
renderQuickActions();
setAssistantMode("chat");
updateControlsState();
connectAssistant();

chatModeButton.addEventListener("click", () => setAssistantMode("chat"));
voiceModeButton.addEventListener("click", () => setAssistantMode("voice"));
sendButton.addEventListener("click", () => sendChatMessage(chatInput.value));
chatInput.addEventListener("input", updateControlsState);
chatInput.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    event.preventDefault();
    sendChatMessage(chatInput.value);
  }
});
micButton.addEventListener("click", startListening);
