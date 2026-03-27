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

function renderCard(product, analysis, isRecommended) {
  const card = document.createElement("div");
  card.className = `product-card ${riskClass(analysis.risk)}`;
  card.dataset.id = product.id;

  // Stamps
  if (analysis.risk === "Critical") {
    const stamp = document.createElement("div");
    stamp.className = "scam-stamp";
    stamp.textContent = "⚠️ High Risk";
    card.appendChild(stamp);
  }
  if (isRecommended) {
    const stamp = document.createElement("div");
    stamp.className = "recommended-stamp";
    stamp.textContent = "⭐ Recommended";
    card.appendChild(stamp);
  }

  const img = document.createElement("img");
  img.className = "product-image";
  img.src = product.image_url;
  img.alt = product.name;
  card.appendChild(img);

  const body = document.createElement("div");
  body.className = "product-body";

  // Risk badge
  const badge = document.createElement("span");
  badge.className = `risk-badge ${riskClass(analysis.risk)}`;
  badge.textContent = `${riskEmoji(analysis.risk)} ${analysis.risk} Risk`;
  body.appendChild(badge);

  // Name
  const name = document.createElement("div");
  name.className = "product-name";
  name.textContent = product.name;
  body.appendChild(name);

  // Price
  const price = document.createElement("div");
  price.className = "product-price";
  price.textContent = `€${product.price.toFixed(2)}`;
  body.appendChild(price);

  const marketPrice = document.createElement("div");
  marketPrice.className = "product-market-price";
  marketPrice.textContent = `Market avg: €${product.market_avg_price.toFixed(2)}`;
  body.appendChild(marketPrice);

  // Seller
  const seller = document.createElement("div");
  seller.className = "product-seller";
  seller.textContent = `🏪 ${product.seller.name} · ⭐ ${product.rating}`;
  body.appendChild(seller);

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
