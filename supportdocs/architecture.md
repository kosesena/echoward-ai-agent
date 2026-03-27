# EchoWard — Architecture Reference

## Problem Focus

EchoWard solves one problem: **vulnerable users (elderly, visually impaired, cognitively challenged) are disproportionately targeted by online shopping scams.** The architecture is designed around this single problem.

---

## Agent Map

```
User (Voice)
    │
    ▼ Azure Speech STT
┌───────────────────────────┐
│   EchoWard Orchestrator   │  ← Copilot Studio
│   - Intent classification │
│   - Conversation routing  │
└───────────┬───────────────┘
            │
    ┌───────┴──────────┐
    │                  │
    ▼                  ▼
Shopping           Scam Detector  ← MAIN AGENT (Copilot Studio)
Assistant          │
(Minimal)          ├─ Risk Scoring Engine (Power Automate)
                   ├─ Azure AI Search (scam pattern DB)
                   ├─ Azure Content Safety (URL filtering)
                   ├─ Image Audit (Azure AI Foundry / GPT-4o Vision)
                   └─ HITL Approval Flow
                        │
                        ▼ Azure Speech TTS
                   User hears alert
```

---

## Data Flow

### Happy Path — No Scam Detected

```
1. User: "Find me headphones under 50 euros"
2. Azure Speech STT → text
3. Orchestrator: intent = product_search
4. Shopping Assistant: retrieves 3 results from Azure AI Search
5. Scam Detector: analyzes all 3 in parallel
   - Risk Scoring Engine: price, seller age, reviews, URL, return policy
   - Image Audit: GPT-4o Vision checks each product image
6. All results scored Low → Shopping Assistant presents results with ✅
7. User selects → Shopping Assistant guides checkout
8. Azure Speech TTS → user hears each step
```

### Alert Path — Scam Detected

```
1. Shopping Assistant retrieves results
2. Scam Detector scores result #2: CRITICAL
   - Price 80% below market → +3
   - Seller age 3 days → +2
   - Zero reviews → +1
   - Image mismatch (fake) → +3
   Total score: 9 → Critical
3. Orchestrator triggers HITL approval topic
4. User hears:
   "⚠️ Option 2 has been flagged as critically risky.
    This price is 80% below what this product normally costs.
    The seller account was created 3 days ago.
    The product image does not match the description.
    I strongly recommend not purchasing from this seller.
    Say YES to proceed anyway, or NO to go back."
5. User: "No"
6. Transaction cancelled. Orchestrator continues with options 1 and 3.
```

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Agent orchestration | Microsoft Copilot Studio | Handoff pattern — orchestrator + 2 agents |
| Risk scoring | Power Automate + Azure Function | Evaluate seller, price, URL signals |
| Scam pattern database | Azure AI Search | Known bad sellers, URLs, price baselines |
| URL/content safety | Azure Content Safety | Phishing URL detection, content filtering |
| Image fraud detection | Azure AI Foundry — GPT-4o Vision | Fake/reused/AI-generated product image detection |
| Voice interface | Azure Speech Services — STT + TTS | Accessible voice-first interaction |
| HITL approval | Copilot Studio adaptive cards | Pause + explicit user confirmation for high-risk |

---

## Risk Scoring Logic

```
Signal                              | Points
------------------------------------|--------
Price 50–70% below market           | +1 (Medium)
Price 70–80% below market           | +2 (High)
Price >80% below market             | +3 (Critical)
Seller age 7–30 days                | +1
Seller age <7 days                  | +2
Zero reviews                        | +1
Suspicious URL pattern              | +2
No return policy                    | +1
Image verdict = "suspicious"        | +1
Image verdict = "fake"              | +3
------------------------------------|--------
Score 0        → Low
Score 1–2      → Medium
Score 3–4      → High
Score ≥5       → Critical
```

---

## Responsible AI Summary

| Principle | Implementation |
|---|---|
| Transparency | Every alert includes a plain-language explanation of why it was flagged |
| Human-in-the-loop | High/Critical risk transactions cannot proceed without explicit user confirmation |
| Privacy | No voice or session data stored after conversation ends |
| Fairness | Risk scoring is signal-based, not demographic-based |
| Accountability | All risk decisions and user overrides are logged in Azure Monitor |
