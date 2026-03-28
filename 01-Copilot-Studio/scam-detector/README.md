# Scam Detector Agent

The Scam Detector is **EchoWard's core agent**. It analyzes every product listing that a vulnerable user considers purchasing, assigns a risk score, explains any risks in plain language, and pauses high-risk transactions for human-in-the-loop confirmation.

---

## 🎯 What It Does

For every product result:

1. **Collect signals** — seller age, review count, price vs. market average, URL patterns, return policy, product images
2. **Score the risk** — Low / Medium / High / Critical
3. **Explain in plain language** — no jargon, no technical terms
4. **Act based on score:**
   - Low → proceed silently
   - Medium → brief voice warning, proceed
   - High → clear alert, ask user to confirm
   - Critical → block transaction, HITL approval required

---

## 🚨 Risk Signals Reference

| Signal | Weight | Example |
|---|---|---|
| Price >50% below market average | High | MacBook Pro at €189 |
| Price >70% below market average | Critical | Upgrade previous signal |
| Seller account age <30 days | Medium | New seller with no history |
| Seller account age <7 days | High | Brand-new account |
| Zero reviews | Medium | No buyer feedback at all |
| Suspicious URL pattern | High | `amaz0n-deals.xyz`, homograph attacks |
| No return / refund policy | Medium | Seller explicitly blocks returns |
| Fake or reused product image | High | GPT-4o Vision flags image mismatch |
| 2+ Medium signals combined | High | Automatic escalation |
| 1+ High signal + any Medium | Critical | Automatic escalation |

---

## 🛠️ Setup in Copilot Studio

### Step 1: Create the Agent

1. Open [Microsoft Copilot Studio](https://copilotstudio.microsoft.com)
2. Click **+ Create** → **New agent**
3. Name: `Scam Detector`
4. Click **Create**

### Step 2: Configure Instructions

```
You are the Scam Detector for EchoWard — a voice-first AI assistant protecting vulnerable users from online shopping fraud.

Your job is to analyze product listings and protect the user from scams BEFORE they happen.

For every product you receive:
1. Evaluate all available signals (price, seller age, reviews, URL, images)
2. Calculate an overall risk score: Low / Medium / High / Critical
3. Respond with:
   - A clear, plain-language explanation of any risks found
   - A recommendation (safe to proceed, proceed with caution, or do not proceed)
   - A request for explicit confirmation if risk is High or Critical

Rules:
- Never use technical jargon. Speak as if talking to an elderly person
- Always explain WHY something is flagged. Example: "This seller is brand new and has no reviews, which is a common sign of a scam."
- Never make the final decision for the user — always give them the information and let them decide
- For Critical risk: always say "I strongly recommend not purchasing from this seller"
- If risk is Low: a brief "This seller appears safe" is enough — don't overload the user
```

### Step 3: Build the Risk Scoring Action

Create a **Power Automate flow** (or Azure Function) for risk scoring:

**Inputs:**
```json
{
  "product_url": "string",
  "seller_name": "string",
  "seller_age_days": "integer",
  "review_count": "integer",
  "listed_price": "float",
  "market_avg_price": "float",
  "has_return_policy": "boolean",
  "image_url": "string"
}
```

**Scoring logic:**
```
score = 0

if listed_price < market_avg_price * 0.30: score += 3  # Critical signal
elif listed_price < market_avg_price * 0.50: score += 2  # High signal
elif listed_price < market_avg_price * 0.70: score += 1  # Medium signal

if seller_age_days < 7: score += 2
elif seller_age_days < 30: score += 1

if review_count == 0: score += 1

if url_suspicious(product_url): score += 2  # Check for homographs, typosquatting

if not has_return_policy: score += 1

# Map score to level
if score >= 5: risk = "Critical"
elif score >= 3: risk = "High"
elif score >= 1: risk = "Medium"
else: risk = "Low"
```

**Outputs:**
```json
{
  "risk_score": "Low | Medium | High | Critical",
  "risk_reasons": ["list of plain-language reasons"],
  "recommendation": "string"
}
```

### Step 4: Connect to Azure AI Foundry (Image Check)

For each product, call the Visual Audit endpoint (see `02-Azure-AI-Foundry/README.md`):

- Input: `image_url`, `product_description`
- Output: `image_authentic` (boolean), `image_notes` (string)
- If `image_authentic = false`: add +2 to risk score, add reason to `risk_reasons`

### Step 5: Build the HITL Approval Topic

Create a topic `HITL Approval` triggered when `risk_score` is `High` or `Critical`:

**Flow:**
```
1. EchoWard speaks the alert:
   "⚠️ Warning: This listing has been flagged as [risk_score] risk.
   Here is why: [risk_reasons read aloud one by one]
   I strongly recommend not purchasing from this seller.
   Do you still want to continue? Say YES to proceed or NO to go back."

2. Wait for user response
   → YES: log override with timestamp, allow transaction, note in audit log
   → NO: cancel, return to product list
   → No response after 10 seconds: repeat the warning once, then cancel

3. (Future) Send notification to registered caregiver contact
```

### Step 6: Parallel Analysis

The Scam Detector runs **in parallel** with the Shopping Assistant results:

```
Shopping Assistant returns 3 products
    ↓
Scam Detector analyzes all 3 simultaneously
    ↓
Results arrive with risk scores attached
    ↓
Orchestrator presents each result + safety status
```

---

## 🔗 Integrations

| Service | Purpose |
|---|---|
| Power Automate / Azure Function | Risk scoring engine |
| Azure AI Search | Scam pattern database (known bad sellers, URLs) |
| Azure Content Safety | URL phishing and content filtering |
| Azure AI Foundry (GPT-4o Vision) | Fake/reused product image detection |
| Copilot Studio HITL | Pause flow and request user confirmation |

---

## ✅ Test Scenarios

| Scenario | Risk Score | Expected Behavior |
|---|---|---|
| Price 75% below market, seller 3 days old, 0 reviews | Critical | HITL triggered, strong warning |
| Price 55% below market, no return policy | High | Alert + confirmation required |
| Seller 2 years old, 500 reviews, fair price | Low | Proceed with brief "seller appears safe" |
| Suspicious URL (`amaz0n-deals.xyz`) | High | URL warning + confirmation |
| Fake product image detected by Vision | High | Image mismatch warning added to alert |
| 2 Medium signals combined | High | Auto-escalated, confirmation required |

---

## 🗣️ Voice Alert Examples

**Low risk:**
> "Option 1 looks safe. The seller has been active for 2 years and has over 300 positive reviews."

**Medium risk:**
> "Option 2: just a small heads up — this seller doesn't have a return policy, which is a little unusual. You can still proceed if you'd like."

**High risk:**
> "⚠️ Option 3 has been flagged. The price is 60% below what this product normally costs, and the seller is only 12 days old. This could be a scam. Would you like to skip this one?"

**Critical risk:**
> "⚠️ Warning. This listing has been flagged as critically risky. The price is 80% below market value, the seller account was created 3 days ago, and the product image does not match the description — a common sign of a counterfeit listing. I strongly recommend not purchasing from this seller. Say YES if you still want to proceed, or NO to go back."
