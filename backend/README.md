# Backend — Scam Risk Scorer

This module contains the core risk scoring logic for EchoWard's Scam Detector. It is designed to:

1. **Run locally** for testing and development
2. **Serve as the reference implementation** for the Power Automate flow / Azure Function deployed in Copilot Studio

---

## Files

| File | Purpose |
|---|---|
| `risk_scorer.py` | Core risk scoring engine — input/output schema + scoring logic |

---

## Quick Start

```bash
python backend/risk_scorer.py
```

This runs 4 test cases (2 safe, 1 medium, 1 critical) and prints the risk level and voice alert for each.

**Expected output:**
```
Product: Sony WH-CH510 Wireless Headphones
Risk:    Low (score: 0)

Product: Generic Bluetooth Speaker XL
Risk:    Medium (score: 2)

Product: Samsung Galaxy Watch 5 — Limited Deal
Risk:    Critical (score: 9)

Product: Apple AirPods Pro 2nd Gen — Clearance
Risk:    Critical (score: 10)
```

---

## Risk Scoring Logic

| Signal | Points |
|---|---|
| Price 50–70% below market | +1 |
| Price 70–80% below market | +2 |
| Price >80% below market | +3 |
| Seller age 7–30 days | +1 |
| Seller age <7 days | +2 |
| Zero reviews | +1 |
| <10 reviews | +1 |
| No return policy | +1 |
| Suspicious URL pattern | +2 |
| Image not authentic (GPT-4o Vision) | +3 |

| Total Score | Risk Level |
|---|---|
| 0–1 | Low |
| 2–3 | Medium |
| 4–5 | High |
| 6+ | Critical |

---

## Integration with Copilot Studio

The `risk_scorer.py` logic is replicated in a **Power Automate flow** (or Azure Function) that the Scam Detector agent calls as an action.

**Input (from Copilot Studio):**
```json
{
  "product_name": "string",
  "listed_price": 0.00,
  "market_avg_price": 0.00,
  "seller_name": "string",
  "seller_age_days": 0,
  "review_count": 0,
  "has_return_policy": true,
  "product_url": "string",
  "image_authentic": true,
  "image_note": "string or null"
}
```

**Output (to Copilot Studio):**
```json
{
  "risk_level": "Low | Medium | High | Critical",
  "score": 0,
  "reasons": ["list of plain-language explanations"],
  "recommendation": "string",
  "echoward_voice_alert": "string — ready to speak directly to the user"
}
```

---

## Owner

**Scam logic / backend role** — see team assignments in [README.md](../README.md).
