# 00 — Setup

Before building EchoWard, make sure your environment is ready. This section covers the prerequisites for Microsoft Copilot Studio, Azure AI Foundry, and Azure Speech Services.

---

## ✅ Prerequisites Checklist

### Microsoft Account & Licenses

- [ ] Microsoft 365 account with Copilot Studio access
- [ ] Azure subscription (free tier is sufficient for the hackathon)
- [ ] Azure AI Foundry access enabled on your subscription

### Tools

- [ ] A modern browser (Edge or Chrome recommended)
- [ ] Access to [Microsoft Copilot Studio](https://copilotstudio.microsoft.com)
- [ ] Access to [Azure AI Foundry](https://ai.azure.com)
- [ ] Access to [Azure Portal](https://portal.azure.com)

---

## 🔧 Step-by-Step Setup

### 1. Microsoft Copilot Studio

1. Go to [https://copilotstudio.microsoft.com](https://copilotstudio.microsoft.com)
2. Sign in with your Microsoft 365 account
3. Select or create an **environment** (use the default environment for the hackathon)
4. Confirm you can create a new agent — if prompted for a trial, start the Copilot Studio trial

### 2. Azure Subscription

1. Go to [https://portal.azure.com](https://portal.azure.com)
2. Sign in and verify your subscription is active
3. Create a **Resource Group** named `echoward-rg` in your preferred region (e.g., West Europe)

### 3. Azure AI Foundry

1. Go to [https://ai.azure.com](https://ai.azure.com)
2. Create a new **Azure AI hub** inside `echoward-rg`
3. Create a new **project** named `echoward`
4. Confirm access to GPT-4o and GPT-4o Vision model deployments

### 4. Azure Speech Services

1. In the Azure Portal, search for **Speech** and create a new Speech resource
2. Place it in `echoward-rg`, select your region
3. Copy the **Key** and **Region** — you will need these in Module 03

### 5. Azure AI Search (optional for demo)

1. Create an **Azure AI Search** resource in `echoward-rg`
2. This will be used to store the product catalog and scam pattern database

---

## 🌍 Recommended Regions

Use a single region for all resources to minimize latency:

| Region | Recommended for |
|---|---|
| West Europe | Teams in Europe |
| East US | Teams in North/South America |

---

## ❗ Common Issues

| Issue | Fix |
|---|---|
| Copilot Studio trial not available | Ask your organization admin to enable the Copilot Studio license |
| GPT-4o not available in your region | Try East US or Sweden Central |
| Speech resource quota exceeded | Create the resource in a different region |

---

## ➡️ Next Step

Once all resources are ready, proceed to [01-Copilot-Studio](../01-Copilot-Studio/README.md) to start building the EchoWard orchestrator agent.
