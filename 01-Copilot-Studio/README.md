# 01 — Copilot Studio

This module builds EchoWard's two-agent system in Microsoft Copilot Studio. The architecture is intentionally lean — one orchestrator to handle voice input and routing, and one specialist agent that does the real work: scam detection.

---

## 🏗️ What You'll Build

| Agent | Role | Time |
|---|---|---|
| [EchoWard Orchestrator](./orchestrator/README.md) | Receives voice input, classifies shopping intent, hands off to Scam Detector | ~20 min |
| [Scam Detector](./scam-detector/README.md) | Analyzes every product listing for fraud signals, scores risk, triggers HITL | ~40 min |

> The Shopping Assistant is intentionally minimal — it provides product results as context for the Scam Detector. The scam analysis is the core feature.

---

## 🧭 Build Order

1. **Orchestrator first** — set up the entry point and intent routing
2. **Scam Detector second** — build the risk scoring logic, HITL approval, and voice alerts

---

## 🔑 Key Concepts

### Handoff Pattern

The orchestrator receives all user voice input and routes to the Scam Detector whenever a product search or purchase intent is detected. The Scam Detector then takes ownership of the conversation, validates results, alerts the user, and (if high risk) pauses for approval.

### Human-in-the-Loop (HITL)

When the Scam Detector assigns a **High** or **Critical** risk score, the conversation pauses. The user (or a designated caregiver) must explicitly confirm before the transaction proceeds. This is the key safety mechanism protecting vulnerable users.

### Risk Score Levels

| Level | Meaning | Action |
|---|---|---|
| Low | No significant signals detected | Proceed, mention briefly |
| Medium | 1–2 minor signals | Warn user, allow to proceed |
| High | Strong fraud signal(s) | Alert clearly, require confirmation |
| Critical | Multiple strong signals | Block transaction, trigger HITL |

---

## ➡️ Start Here

Go to [orchestrator/README.md](./orchestrator/README.md) to create the EchoWard Orchestrator first.
