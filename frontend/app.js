// =============================================
// EchoWard — Frontend Demo Logic
// =============================================

// Load product data from demo-data/products.json
// For local demo, products are embedded here (mirrors products.json)
const PRODUCTS = [
  {
    id: 1,
    name: "Sony WH-CH510 Wireless Headphones",
    price: 34.99,
    market_avg_price: 39.99,
    seller: { name: "SonyOfficialStore", age_days: 1460, review_count: 4821, has_return_policy: true },
    url: "#",
    image_url: "https://placehold.co/300x180/e8f5e9/2e7d32?text=Sony+WH-CH510",
    image_authentic: true,
    category: "headphones",
    rating: 4.5,
    expected_risk: "Low"
  },
  {
    id: 2,
    name: "JBL Tune 510BT Wireless Headphones",
    price: 37.99,
    market_avg_price: 42.00,
    seller: { name: "JBL_AudioShop", age_days: 720, review_count: 2103, has_return_policy: true },
    url: "#",
    image_url: "https://placehold.co/300x180/e8f5e9/2e7d32?text=JBL+Tune+510BT",
    image_authentic: true,
    category: "headphones",
    rating: 4.3,
    expected_risk: "Low"
  },
  {
    id: 3,
    name: "Anker Soundcore Q20 Headphones",
    price: 28.99,
    market_avg_price: 32.00,
    seller: { name: "AnkerDirect", age_days: 1095, review_count: 6540, has_return_policy: true },
    url: "#",
    image_url: "https://placehold.co/300x180/e8f5e9/2e7d32?text=Anker+Q20",
    image_authentic: true,
    category: "headphones",
    rating: 4.4,
    expected_risk: "Low"
  },
  {
    id: 4,
    name: "\"Brand New\" Wireless Headphones Pro",
    price: 8.99,
    market_avg_price: 38.00,
    seller: { name: "DealsToday2024", age_days: 4, review_count: 0, has_return_policy: false },
    url: "#",
    image_url: "https://placehold.co/300x180/ffebee/c62828?text=⚠️+Suspicious",
    image_authentic: false,
    image_note: "Generic stock photo — does not match product description",
    category: "headphones",
    rating: 5.0,
    expected_risk: "Critical"
  },
  {
    id: 5,
    name: "Samsung Galaxy Watch 5 — Limited Deal",
    price: 49.99,
    market_avg_price: 249.00,
    seller: { name: "FlashSaleHub", age_days: 11, review_count: 3, has_return_policy: false },
    url: "#",
    image_url: "https://placehold.co/300x180/ffebee/c62828?text=⚠️+Suspicious",
    image_authentic: false,
    image_note: "Image shows an unbranded watch — not Samsung Galaxy Watch 5",
    category: "smartwatch",
    rating: 4.9,
    expected_risk: "Critical"
  },
  {
    id: 6,
    name: "Garmin Vivoactive 4S Smartwatch",
    price: 89.00,
    market_avg_price: 99.99,
    seller: { name: "GarminEU_Official", age_days: 850, review_count: 1342, has_return_policy: true },
    url: "#",
    image_url: "https://placehold.co/300x180/e8f5e9/2e7d32?text=Garmin+Vivoactive",
    image_authentic: true,
    category: "smartwatch",
    rating: 4.6,
    expected_risk: "Low"
  },
  {
    id: 7,
    name: "Generic Bluetooth Speaker XL",
    price: 19.99,
    market_avg_price: 24.00,
    seller: { name: "TechBargainShop", age_days: 28, review_count: 12, has_return_policy: false },
    url: "#",
    image_url: "https://placehold.co/300x180/fff8e1/f57f17?text=Low+Reviews",
    image_authentic: true,
    category: "speaker",
    rating: 3.8,
    expected_risk: "Medium"
  },
  {
    id: 8,
    name: "Apple AirPods Pro 2nd Gen — Clearance",
    price: 29.99,
    market_avg_price: 199.00,
    seller: { name: "AppleDeals99", age_days: 6, review_count: 1, has_return_policy: false },
    url: "#",
    image_url: "https://placehold.co/300x180/ffebee/c62828?text=⚠️+Suspicious",
    image_authentic: false,
    image_note: "Low-quality copy of Apple's official marketing photo",
    category: "earbuds",
    rating: 5.0,
    expected_risk: "Critical"
  }
];

// =============================================
// Risk Scoring Engine (mirrors backend/risk_scorer.py)
// =============================================

function scoreProduct(product) {
  let score = 0;
  const reasons = [];

  // Price anomaly
  const priceDrop = (product.market_avg_price - product.price) / product.market_avg_price;
  if (priceDrop > 0.80) {
    score += 3;
    reasons.push(`Price is ${Math.round(priceDrop * 100)}% below market average — extremely unusual for a legitimate seller.`);
  } else if (priceDrop > 0.70) {
    score += 2;
    reasons.push(`Price is ${Math.round(priceDrop * 100)}% below market average — this is rarely a genuine discount.`);
  } else if (priceDrop > 0.50) {
    score += 1;
    reasons.push(`Price is ${Math.round(priceDrop * 100)}% below market average.`);
  }

  // Seller age
  if (product.seller.age_days < 7) {
    score += 2;
    reasons.push(`This seller account was created ${product.seller.age_days} day(s) ago — too new to trust.`);
  } else if (product.seller.age_days < 30) {
    score += 1;
    reasons.push(`This seller account is only ${product.seller.age_days} days old.`);
  }

  // Reviews
  if (product.seller.review_count === 0) {
    score += 1;
    reasons.push("This seller has zero customer reviews.");
  } else if (product.seller.review_count < 10) {
    score += 1;
    reasons.push(`This seller has only ${product.seller.review_count} review(s).`);
  }

  // Return policy
  if (!product.seller.has_return_policy) {
    score += 1;
    reasons.push("This seller has no return or refund policy.");
  }

  // Image authenticity (simulates GPT-4o Vision result)
  if (!product.image_authentic) {
    score += 3;
    reasons.push(product.image_note || "Product image does not match the description.");
  }

  // Map score to risk level
  let risk;
  if (score >= 6) risk = "Critical";
  else if (score >= 4) risk = "High";
  else if (score >= 2) risk = "Medium";
  else risk = "Low";

  // Safe message for low risk
  if (risk === "Low") {
    reasons.push(`Verified seller — ${product.seller.age_days} days active, ${product.seller.review_count.toLocaleString()} reviews.`);
  }

  return { risk, score, reasons };
}

// =============================================
// Search / Filter Logic
// =============================================

function searchProducts(query) {
  const q = query.toLowerCase();
  const keywords = q.split(/\s+/);

  // Extract max price
  let maxPrice = Infinity;
  const priceMatch = q.match(/under\s+(\d+)|(\d+)\s+euros?|max\s+(\d+)/);
  if (priceMatch) {
    maxPrice = parseFloat(priceMatch[1] || priceMatch[2] || priceMatch[3]);
  }

  // Filter by category keywords + price
  const categoryMap = {
    headphone: "headphones",
    headphones: "headphones",
    earphone: "headphones",
    speaker: "speaker",
    bluetooth: null,
    smartwatch: "smartwatch",
    watch: "smartwatch",
    earbud: "earbuds",
    airpod: "earbuds",
  };

  let category = null;
  for (const kw of keywords) {
    if (categoryMap[kw]) {
      category = categoryMap[kw];
      break;
    }
  }

  return PRODUCTS.filter(p => {
    const priceOk = p.price <= maxPrice;
    const categoryOk = !category || p.category === category;
    return priceOk && categoryOk;
  }).slice(0, 6);
}

// =============================================
// UI Rendering
// =============================================

function riskClass(risk) {
  return `risk-${risk.toLowerCase()}`;
}

function riskEmoji(risk) {
  return { Low: "✅", Medium: "⚠️", High: "🔶", Critical: "🚨" }[risk] || "❓";
}

// Animated circular "safety score" ring (0 risk → 100% safe).
function safetyRing(score, risk) {
  const safety = Math.max(4, Math.min(100, Math.round(100 - score * 9)));
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - safety / 100);

  const wrap = document.createElement("div");
  wrap.className = `safety-ring ${riskClass(risk)}`;
  wrap.setAttribute("role", "img");
  wrap.setAttribute("aria-label", `Safety score ${safety} out of 100`);
  wrap.innerHTML = `
    <svg viewBox="0 0 64 64" width="60" height="60" aria-hidden="true">
      <circle class="ring-track" cx="32" cy="32" r="${r}"></circle>
      <circle class="ring-fill" cx="32" cy="32" r="${r}"
        stroke-dasharray="${circ.toFixed(1)}" stroke-dashoffset="${circ.toFixed(1)}"></circle>
    </svg>
    <div class="ring-center">
      <span class="ring-num">${safety}</span>
      <span class="ring-unit">safe</span>
    </div>`;

  const fill = wrap.querySelector(".ring-fill");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => { fill.style.strokeDashoffset = offset.toFixed(1); })
  );
  return wrap;
}

// Inline line-icon set (no emoji, no external images).
const ICON_PATHS = {
  check: '<path d="M20 6 9 17l-5-5"/>',
  alert: '<path d="M10.3 4 2 18.5A2 2 0 0 0 3.7 21.5h16.6a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z"/><path d="M12 9.5v4.2"/><path d="M12 17.3h.01"/>',
  store: '<path d="M3.5 9.5 5 4.5h14l1.5 5a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0Z"/><path d="M5 11v8.5h14V11"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.8.85-4.2 4.05 1 5.8L12 16.9l-5.2 2.6 1-5.8-4.2-4.05 5.8-.85L12 3.5Z"/>',
  headphones: '<path d="M4 13a8 8 0 0 1 16 0"/><rect x="3" y="13" width="4" height="7.5" rx="1.6"/><rect x="17" y="13" width="4" height="7.5" rx="1.6"/>',
  smartwatch: '<rect x="7" y="7" width="10" height="10" rx="2.5"/><path d="M9.2 7 8.5 3.5h7L14.8 7"/><path d="M9.2 17l-.7 3.5h7L14.8 17"/>',
  speaker: '<rect x="6" y="3" width="12" height="18" rx="2.5"/><circle cx="12" cy="14.5" r="3"/><circle cx="12" cy="7" r="1"/>',
  earbuds: '<path d="M9 8a3 3 0 0 0-3 3 3 3 0 0 0 3 3V8Z"/><path d="M9 8c2.6 0 4 1.6 4 4.2V17"/><path d="M15 8a3 3 0 0 1 3 3 3 3 0 0 1-3 3V8Z"/><path d="M15 8c-2.6 0-4 1.6-4 4.2"/>',
  shield: '<path d="M12 3 5 5.5v5.5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9V5.5L12 3Z"/><path d="m9.5 12 1.8 1.8L15 10"/>',
};

function icon(name, size = 18) {
  return `<svg class="ic" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ICON_PATHS.shield}</svg>`;
}

const CATEGORY_ICON = { headphones: "headphones", smartwatch: "smartwatch", speaker: "speaker", earbuds: "earbuds" };

function renderCard(product, analysis, isRecommended) {
  const card = document.createElement("div");
  card.className = `product-card ${riskClass(analysis.risk)}`;
  card.dataset.id = product.id;

  // Stamps
  if (analysis.risk === "Critical") {
    const stamp = document.createElement("div");
    stamp.className = "scam-stamp";
    stamp.innerHTML = `${icon("alert", 13)}<span>High risk</span>`;
    card.appendChild(stamp);
  }
  if (isRecommended) {
    const stamp = document.createElement("div");
    stamp.className = "recommended-stamp";
    stamp.innerHTML = `${icon("check", 13)}<span>EchoWard's pick</span>`;
    card.appendChild(stamp);
  }

  // Designed monochrome product tile (no stock photos)
  const thumb = document.createElement("div");
  thumb.className = "product-thumb";
  thumb.innerHTML = icon(CATEGORY_ICON[product.category] || "shield", 44);
  card.appendChild(thumb);

  const body = document.createElement("div");
  body.className = "product-body";

  // Head row: risk badge + animated safety ring
  const head = document.createElement("div");
  head.className = "card-head";

  const badge = document.createElement("span");
  badge.className = `risk-badge ${riskClass(analysis.risk)}`;
  badge.innerHTML = `${icon(analysis.risk === "Low" ? "check" : "alert", 13)}<span>${analysis.risk} risk</span>`;
  head.appendChild(badge);

  head.appendChild(safetyRing(analysis.score, analysis.risk));
  body.appendChild(head);

  // Name
  const name = document.createElement("div");
  name.className = "product-name";
  name.textContent = product.name;
  body.appendChild(name);

  // Price row
  const priceRow = document.createElement("div");
  priceRow.className = "price-row";
  priceRow.innerHTML =
    `<span class="product-price">€${product.price.toFixed(2)}</span>` +
    `<span class="product-market-price">avg €${product.market_avg_price.toFixed(2)}</span>`;
  body.appendChild(priceRow);

  // Seller
  const seller = document.createElement("div");
  seller.className = "product-seller";
  seller.innerHTML =
    `${icon("store", 15)}<span>${product.seller.name}</span>` +
    `<span class="sep">·</span>${icon("star", 15)}<span>${product.rating.toFixed(1)}</span>`;
  body.appendChild(seller);

  const divider = document.createElement("div");
  divider.className = "card-divider";
  body.appendChild(divider);

  // Reasons
  const reasons = document.createElement("div");
  reasons.className = "risk-reasons";
  analysis.reasons.forEach(r => {
    const item = document.createElement("div");
    item.className = "risk-reason-item";
    item.textContent = r;
    reasons.appendChild(item);
  });
  body.appendChild(reasons);

  // Action button
  const btn = document.createElement("button");
  btn.className = `card-action ${analysis.risk === "Low" ? "safe" : "risky"}`;
  btn.textContent = analysis.risk === "Low" ? "Select this option" : "View details & warnings";
  btn.addEventListener("click", () => handleCardClick(product, analysis));
  body.appendChild(btn);

  card.appendChild(body);
  return card;
}

function handleCardClick(product, analysis) {
  if (analysis.risk === "High" || analysis.risk === "Critical") {
    showWarningModal(product, analysis);
  } else {
    showSafeToast(product);
  }
}

function showWarningModal(product, analysis) {
  document.getElementById("modalTitle").textContent =
    analysis.risk === "Critical" ? "Critical Risk Detected" : "High Risk Detected";

  const badge = document.getElementById("modalRiskBadge");
  badge.textContent = `${analysis.risk.toUpperCase()} RISK`;
  badge.className = `risk-badge ${riskClass(analysis.risk)}`;
  badge.style.fontSize = "14px";
  badge.style.padding = "6px 14px";

  document.getElementById("modalProductName").textContent = product.name;

  const reasonsEl = document.getElementById("modalReasons");
  reasonsEl.innerHTML = "";
  analysis.reasons.forEach(r => {
    const div = document.createElement("div");
    div.className = "modal-reason";
    div.innerHTML = `<span>⚠️</span><span>${r}</span>`;
    reasonsEl.appendChild(div);
  });

  document.getElementById("warningModal").classList.remove("hidden");

  document.getElementById("modalNo").onclick = () => {
    document.getElementById("warningModal").classList.add("hidden");
  };
  document.getElementById("modalYes").onclick = () => {
    document.getElementById("warningModal").classList.add("hidden");
    showSafeToast(product, true);
  };
}

function showSafeToast(product, override = false) {
  const toast = document.getElementById("safeToast");
  toast.textContent = override
    ? `⚠️ Proceeding to checkout for: ${product.name}`
    : `✅ Great choice! Proceeding to checkout for: ${product.name}`;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3500);
}

// =============================================
// Search Flow
// =============================================

function runSearch(query) {
  if (!query.trim()) return;

  // Show status bar
  const statusBar = document.getElementById("statusBar");
  const statusText = document.getElementById("statusText");
  statusBar.classList.remove("hidden");
  statusText.textContent = "Searching and checking safety for each result...";

  // Hide results
  document.getElementById("resultsSection").classList.add("hidden");
  document.getElementById("recommendationBanner").classList.add("hidden");
  document.getElementById("resultsGrid").innerHTML = "";

  // Simulate async analysis (1.5s delay for demo effect)
  setTimeout(() => {
    const products = searchProducts(query);

    if (products.length === 0) {
      statusText.textContent = `No results found for "${query}". Try: headphones, smartwatch, speaker.`;
      return;
    }

    statusText.textContent = `Found ${products.length} results — safety check complete.`;

    // Score all products
    const scored = products.map(p => ({
      product: p,
      analysis: scoreProduct(p)
    }));

    // Find recommended (lowest risk score, or first Low)
    const safeOptions = scored.filter(s => s.analysis.risk === "Low");
    const recommended = safeOptions.length > 0 ? safeOptions[0] : null;

    // Show recommendation banner
    if (recommended) {
      document.getElementById("recommendedProduct").textContent =
        `${recommended.product.name} — €${recommended.product.price.toFixed(2)} — ${recommended.analysis.risk} risk`;
      document.getElementById("recommendationBanner").classList.remove("hidden");
    }

    // Render cards
    const grid = document.getElementById("resultsGrid");
    scored.forEach(({ product, analysis }) => {
      const isRecommended = recommended && product.id === recommended.product.id;
      grid.appendChild(renderCard(product, analysis, isRecommended));
    });

    document.getElementById("resultsSection").classList.remove("hidden");

    // Scroll to results
    document.getElementById("resultsSection").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 1500);
}

// =============================================
// Event Listeners
// =============================================

document.getElementById("searchBtn").addEventListener("click", () => {
  runSearch(document.getElementById("searchInput").value);
});

document.getElementById("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") runSearch(e.target.value);
});

// Chip suggestions
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    const query = chip.dataset.query;
    document.getElementById("searchInput").value = query;
    runSearch(query);
  });
});

// Voice input (Web Speech API)
const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");

if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  voiceBtn.addEventListener("click", () => {
    recognition.start();
    voiceBtn.classList.add("listening");
    voiceStatus.classList.remove("hidden");
  });

  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    document.getElementById("searchInput").value = transcript;
    voiceBtn.classList.remove("listening");
    voiceStatus.classList.add("hidden");
    runSearch(transcript);
  };

  recognition.onerror = () => {
    voiceBtn.classList.remove("listening");
    voiceStatus.classList.add("hidden");
  };

  recognition.onend = () => {
    voiceBtn.classList.remove("listening");
    voiceStatus.classList.add("hidden");
  };
} else {
  // Hide voice button if not supported
  voiceBtn.title = "Voice input not supported in this browser";
  voiceBtn.style.opacity = "0.4";
  voiceBtn.style.cursor = "not-allowed";
}

// Close modal on overlay click
document.getElementById("warningModal").addEventListener("click", e => {
  if (e.target === document.getElementById("warningModal")) {
    document.getElementById("warningModal").classList.add("hidden");
  }
});
