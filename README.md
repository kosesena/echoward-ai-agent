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

```mermaid
flowchart TD
    U([🎙️ User\nVoice / Text]) --> STT

    STT["Azure Speech Services\nSpeech-to-Text"]
    STT --> ORC

    ORC["🤖 EchoWard Orchestrator\nMicrosoft Copilot Studio\nIntent classification & routing"]
    ORC --> SA
    ORC --> SD

    SA["🛒 Shopping Assistant\nMicrosoft Copilot Studio\nProduct search & results"]
    SA --> SD

    SD["🔍 Scam Detector\n★ MAIN AGENT ★\nMicrosoft Copilot Studio"]
    SD --> RS
    SD --> URL
    SD --> IMG
    SD --> HITL

    RS["📊 Risk Scoring Engine\nPrice anomaly · Seller age\nReview count · Return policy"]
    URL["🔗 URL Safety Check\nAzure Content Safety\nPhishing & typosquatting detection"]
    IMG["🖼️ Fake Image Detection\nAzure AI Foundry\nGPT-4o Vision"]
    HITL["🧑 Human-in-the-Loop\nHigh / Critical risk:\nUser confirms before purchase"]

    SD --> TTS
    TTS["Azure Speech Services\nText-to-Speech"]
    TTS --> UO([🔊 User hears\nsafe recommendation\nor scam alert])

    style U fill:#e8f0fe,stroke:#1a73e8,color:#1a1a2e
    style UO fill:#e8f5e9,stroke:#2e7d32,color:#1a1a2e
    style ORC fill:#e8f0fe,stroke:#1a73e8,color:#1a1a2e
    style SA fill:#e8f0fe,stroke:#1a73e8,color:#1a1a2e
    style SD fill:#fff3e0,stroke:#e65100,color:#1a1a2e
    style RS fill:#fff8e1,stroke:#f57f17,color:#1a1a2e
    style URL fill:#fff8e1,stroke:#f57f17,color:#1a1a2e
    style IMG fill:#fff8e1,stroke:#f57f17,color:#1a1a2e
    style HITL fill:#ffebee,stroke:#c62828,color:#1a1a2e
    style STT fill:#f3e5f5,stroke:#6a1b9a,color:#1a1a2e
    style TTS fill:#f3e5f5,stroke:#6a1b9a,color:#1a1a2e
```

| Color | Component |
|---|---|
| 🔵 Blue | Microsoft Copilot Studio agents & user |
| 🟠 Orange | Scam Detector — main agent |
| 🟡 Yellow | Risk scoring, URL check, image detection |
| 🔴 Red | Human-in-the-Loop approval |
| 🟣 Purple | Azure Speech Services (STT / TTS) |

---

## 👥 Team

Alexandra · Ceren · Sarper · Sarper Kahvecioglu · Sena

*Role assignments to be confirmed — 5 members, tasks TBD.*

---

## ⏱️ Hackathon Build Order (Day 2)

| Phase | Time | Deliverable |
|---|---|---|
| Setup | 12:00 – 12:15 | GitHub access, Copilot Studio, Azure — all confirmed |
| Phase 1 | 12:15 – 13:15 | Orchestrator + Scam Detector skeleton in Copilot Studio |
| Phase 2 | 13:15 – 14:30 | Scam logic wired up, Shopping Assistant connected, HITL flow |
| Phase 3 | 14:30 – 15:30 | Azure Foundry image check, Azure Speech voice I/O, frontend live |
| Phase 4 | 15:30 – 16:15 | End-to-end test with demo scenario, pitch polish |
| Pitch | 17:15 – 19:15 | Live demo + jury presentation |

---


## 🗂️ Repo Structure

```
echoward-ai-agent/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── backend/
│   ├── risk_scorer.py
│   └── README.md
├── demo-data/
│   ├── products.json
│   └── scam_cases.json
├── 00-Setup/
├── 01-Copilot-Studio/
│   ├── orchestrator/
│   ├── shopping-assistant/
│   └── scam-detector/
├── 02-Azure-AI-Foundry/
├── 03-Azure-Speech/
├── supportdocs/
└── use-cases/
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

```mermaid
sequenceDiagram
    actor U as 🎙️ User
    participant E as 🛡️ EchoWard
    participant SA as 🛒 Shopping Assistant
    participant SD as 🔍 Scam Detector

    U->>E: "Find me headphones under 40 euros."
    E->>SA: Search products under €40
    SA-->>E: Returns 3 results

    E->>SD: Analyze all 3 listings (parallel)

    Note over SD: Option 1 — Sony €34.99<br/>Seller: 4 years active, 4800+ reviews ✅
    Note over SD: Option 2 — "Brand New" €8.99<br/>Price 76% below market 🚨<br/>Seller: 4 days old, 0 reviews 🚨<br/>Fake product image detected 🚨
    Note over SD: Option 3 — Anker €28.99<br/>Seller: 3 years active, 6500+ reviews ✅

    SD-->>E: Risk scores attached to each result

    E->>U: "Option 1: Sony WH-CH510, €34.99. ✅ Safe."
    E->>U: "Option 2: ⚠️ CRITICAL RISK — price 76% below market,<br/>seller 4 days old, fake image detected. Skip this one?"
    E->>U: "Option 3: Anker Q20, €28.99. ✅ Safe."
    E->>U: "EchoWard recommends Option 1 or 3."

    U->>E: "I'll take option 1."
    E->>U: "Great choice. Proceeding to checkout. ✅"
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
