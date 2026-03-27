# EchoWard — Your voice, your shield. 🛡️

> A voice-first AI agent that protects vulnerable users from online shopping scams in real time.

**AI for Good Hackathon 2026 | March 27–28, 2026 | Online Event**

Built with **Microsoft Copilot Studio** | **Azure AI Foundry** | **Azure Speech Services**

---

## ❓ The Problem

Vulnerable populations — elderly users, people with visual impairments, and those with cognitive disabilities — are disproportionately targeted by online shopping scams:

- **1 in 3 elderly adults** reports being targeted by an online scam every year
- Financial exploitation of vulnerable adults costs **$28.3 billion annually** in the US alone
- Scam tactics (fake sellers, price manipulation, counterfeit listings) are increasingly sophisticated
- Existing platforms offer **no proactive fraud protection** at the point of purchase

**The gap:** Vulnerable users need a trusted companion that detects scams *before* they happen — not after.

---

## 🧩 Our Solution

EchoWard sits alongside the user during online shopping and:

1. **Analyzes every product listing** for fraud signals (seller reputation, price anomalies, URL safety, fake images)
2. **Alerts in plain language** — no jargon, just clear explanations a non-technical user understands
3. **Pauses high-risk transactions** with a human-in-the-loop confirmation before any money moves
4. **Voice-first** — works for visually impaired and elderly users who struggle with traditional UIs

---

## 🏗️ Architecture

```
User (Voice / Text)
    │
    ▼ Azure Speech STT
┌───────────────────────────┐
│   EchoWard Orchestrator   │  ← Copilot Studio
└───────────┬───────────────┘
            │ Handoff
            ▼
┌───────────────────────────────────────┐
│         Scam Detector                 │  ← MAIN AGENT (Copilot Studio)
│  • Seller age & review check          │
│  • Price anomaly detection            │
│  • Suspicious URL analysis            │
│  • Fake image verification ───────────┼──→ Azure AI Foundry (GPT-4o Vision)
│  • Risk score: Low/Medium/High/Crit.  │
│  • HITL approval for high-risk buys   │
└───────────────────────────────────────┘
            │
            ▼ Azure Speech TTS
       User hears the alert
```

---

## 👥 Team & Roles

| Person | Role |
|---|---|
| **Sena** | Frontend UI (`frontend/`) + presentation support |
| **Ceren** | Copilot Studio — EchoWard Orchestrator (`01-Copilot-Studio/orchestrator/`) |
| **Sarper K.** | Scam logic / backend (`backend/`) + Scam Detector agent (`01-Copilot-Studio/scam-detector/`) |
| **Sarper** | Azure AI Foundry — image fraud detection (`02-Azure-AI-Foundry/`) + Azure Speech (`03-Azure-Speech/`) |
| **Alexandra** | Docs, testing, demo scenario coordination (`use-cases/`, `supportdocs/`) + pitch flow |

---

## ⏱️ Hackathon Build Order (Day 2)

| Phase | Time | Who | Deliverable |
|---|---|---|---|
| Setup | 12:00 – 12:15 | Everyone | GitHub access, Copilot Studio, Azure — all confirmed |
| Phase 1 | 12:15 – 13:15 | Ceren + Sarper K. | Orchestrator + Scam Detector skeleton in Copilot Studio |
| Phase 2 | 13:15 – 14:30 | Sarper K. + Sarper | Scam logic wired up, Shopping Assistant connected, HITL flow |
| Phase 3 | 14:30 – 15:30 | Sarper + Sena | Azure Foundry image check, Azure Speech voice I/O, frontend live |
| Phase 4 | 15:30 – 16:15 | Alexandra + all | End-to-end test with demo scenario, pitch polish |
| Pitch | 17:15 – 19:15 | All | Live demo + jury presentation |

---

## 🗂️ Repo Structure

```
echoward-ai-agent/
├── frontend/               ← Demo website (Sena)
│   ├── index.html          Voice/text search, product cards, risk badges, warning modal
│   ├── style.css
│   └── app.js              Risk scoring UI logic + demo data
│
├── backend/                ← Scam logic (Sarper K.)
│   ├── risk_scorer.py      Core risk scoring engine (mirrors Copilot Studio action)
│   └── README.md
│
├── demo-data/              ← Shared by all
│   ├── products.json       8 products: safe, medium-risk, and scam examples
│   └── scam_cases.json     5 scam patterns with plain-language explanations
│
├── 00-Setup/               ← Environment setup guide
├── 01-Copilot-Studio/      ← Agent builds (Ceren + Sarper K.)
│   ├── orchestrator/
│   ├── shopping-assistant/
│   └── scam-detector/
├── 02-Azure-AI-Foundry/    ← Fake image detection (Sarper)
├── 03-Azure-Speech/        ← Voice interface (Sarper)
│
├── supportdocs/            ← Architecture + Responsible AI (Alexandra)
└── use-cases/              ← Demo scenarios (Alexandra)
```

---

## 🚨 What EchoWard Detects

| Signal | Example |
|---|---|
| Price too far below market | MacBook Pro at €189 (normally €2000+) |
| Brand-new seller, zero reviews | Account created 3 days ago |
| Suspicious URL | `amaz0n-deals.xyz` instead of `amazon.com` |
| Fake product image | Stock photo used for a "branded" item |
| No return policy | Seller blocks all refunds |

---

## 🗺️ Demo Scenario (Pitch)

```
User:      "Find me headphones under 40 euros."
EchoWard:  "Searching and checking safety for each result..."

           Option 1: Sony WH-CH510, €34.99. ✅ Safe seller.
           Option 2: "Brand New" Headphones Pro, €8.99.
                     ⚠️ CRITICAL RISK — price 76% below market,
                     seller 4 days old, fake product image detected.
           Option 3: Anker Q20, €28.99. ✅ Safe seller.

           EchoWard recommends: Option 1 or 3.

User:      "I'll take option 1."
EchoWard:  "Great choice. Proceeding to checkout."
```

---

## 🌍 Social Impact

| SDG | EchoWard Contribution |
|---|---|
| SDG 10 — Reduced Inequalities | Gives vulnerable users the same protection as tech-savvy users |
| SDG 16 — Peace, Justice & Strong Institutions | Actively combats financial exploitation |
| SDG 3 — Good Health & Well-being | Reduces financial stress and anxiety from scams |

---

## 📌 Project Metadata

- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
- [SECURITY.md](SECURITY.md)
- [SUPPORT.md](SUPPORT.md)
- [LICENSE](LICENSE)
