# Responsible AI Design — EchoWard

EchoWard protects one of society's most vulnerable groups from financial fraud. This means responsible AI design is not optional — it is a core requirement.

---

## The Stakes

Our users are:
- **Elderly people** who may not recognize modern scam tactics
- **Visually impaired users** who cannot visually verify product listings
- **People with cognitive disabilities** who may find it hard to evaluate legitimacy

A false negative (missed scam) can cause real financial harm. A false positive (wrongly flagging a safe seller) can erode user trust and make EchoWard unusable. Both failures matter.

---

## Microsoft Responsible AI Principles Applied

### 1. Transparency

**Every alert must explain why.**

We never say "this is risky" without explaining the reason in plain language:

| Instead of... | We say... |
|---|---|
| "High risk detected" | "This seller account was created 4 days ago, which is unusual for a legitimate store." |
| "URL flagged" | "This website address looks like Amazon's but has a small difference — a common trick used by scammers." |
| "Image mismatch" | "The product photo doesn't show the brand that's listed, which can be a sign of a counterfeit." |

The user always knows what EchoWard found and why it matters.

---

### 2. Human-in-the-Loop (HITL)

**EchoWard never blocks a purchase — it informs and pauses.**

For High and Critical risk:
- The conversation pauses
- The user hears a clear, specific warning
- The user must explicitly say YES to proceed or NO to cancel
- If there is no response, EchoWard repeats the warning once, then cancels

This preserves user autonomy. EchoWard is not a gatekeeper — it is a trusted advisor.

---

### 3. Privacy

- **No voice data is stored.** All speech processing happens in real time via Azure Speech Services.
- **No user profiles are persisted** beyond the active session.
- **No purchase history or behavioral data is retained.**
- Product searches contain no PII — queries are made anonymously.

---

### 4. Fairness

**Risk scoring is based on objective signals, not user demographics.**

The Scam Detector scores listings based on:
- Price vs. market average (objective)
- Seller account age (objective)
- Review count (objective)
- URL patterns (deterministic rules)
- Image analysis (model output)

It does not factor in the user's age, location, disability status, or any demographic information.

**Bias monitoring:**
The risk scoring system will be monitored to ensure it does not disproportionately flag sellers from specific regions, categories, or price points due to data bias in the scam pattern database.

---

### 5. Reliability & Safety

- The Scam Detector runs on **every product result**, not just ones that look suspicious
- If the scoring engine fails (network error, timeout), EchoWard errs on the side of caution: the listing is flagged as "unable to verify" and the user is informed
- Azure Content Safety provides an independent safety layer on all URLs and content
- HITL ensures that even if the scoring is wrong, the user has the final say

---

### 6. Accountability

- All risk decisions (score, reasons, recommendation) are logged in Azure Monitor
- All user overrides ("proceed anyway" on a High/Critical listing) are logged with timestamp
- These logs allow the team to:
  - Review false positive / false negative rates
  - Improve the scoring model over time
  - Investigate specific incidents if a user reports harm

---

## UN SDG Alignment

| SDG | EchoWard Contribution |
|---|---|
| SDG 3 — Good Health & Well-being | Reduces financial stress and anxiety from scams |
| SDG 10 — Reduced Inequalities | Gives vulnerable users the same protection wealthy or tech-savvy users have |
| SDG 16 — Peace, Justice & Strong Institutions | Actively combats financial exploitation of vulnerable adults |

---

## What We Are Careful About

### We are not a law enforcement tool
EchoWard flags risk to the user. It does not report sellers to authorities or block them at a platform level. That is outside our scope and requires different accountability structures.

### We accept that we will have false positives
A legitimate new seller may be flagged. We accept this trade-off in favor of user protection. We mitigate the impact by:
- Explaining exactly why the flag was raised
- Letting the user proceed if they choose
- Ensuring the language is "I recommend caution" rather than "this is definitely a scam"

### We do not make the decision for the user
EchoWard informs. The user decides. Always.
