# Shopping Assistant Agent

The Shopping Assistant provides product search results that serve as input for the Scam Detector. It is intentionally lightweight — its job is to retrieve listings, not to evaluate them. All safety analysis is handled by the Scam Detector.

---

## 🎯 Responsibilities

- Parse the user's voice query (product type, budget, preferences)
- Search the product catalog via Azure AI Search
- Return raw results (name, price, seller, URL, image URL) to the orchestrator
- Present the final (scam-scored) results to the user
- Guide checkout for safe (Low/Medium risk) selections

---

## 🛠️ Setup in Copilot Studio

### Step 1: Create the Agent

1. In Copilot Studio, click **+ Create** → **New agent**
2. Name: `Shopping Assistant`
3. Click **Create**

### Step 2: Configure Instructions

```
You are the Shopping Assistant for EchoWard. Your only job is to find products based on the user's request and pass the results to the Scam Detector for safety analysis.

When given a product query:
1. Extract: product type, maximum budget, any preferences
2. Retrieve the top 3–5 results
3. Pass ALL results to the Scam Detector before presenting anything to the user
4. Present results only AFTER the Scam Detector has scored them — always include the safety status

Never present an unscored result to the user.
If the Scam Detector flags a result, always relay the warning clearly.
```

### Step 3: Product Search Action

Connect to Azure AI Search or a product API:

- Input: `query` (string), `max_price` (number)
- Output per result: `product_name`, `price`, `seller_name`, `seller_age_days`, `review_count`, `product_url`, `image_url`, `has_return_policy`, `market_avg_price`

### Step 4: Result Presentation

After Scam Detector scores are returned, present each option:

```
Safe:     "Option 1: [Name], [Price]. Verified safe. ✅"
Medium:   "Option 2: [Name], [Price]. Minor concern: [reason]. Proceed with caution."
High:     "Option 3: [Name], [Price]. ⚠️ Flagged as risky — [reason]."
Critical: "Option 4 has been blocked as a high-risk listing."
```

---

## 🔗 Integrations

| Service | Purpose |
|---|---|
| Azure AI Search | Product catalog |
| Scam Detector Agent | Safety analysis of every result |
