# 02 — Azure AI Foundry: Fake Image Detection

One of the most common and hardest-to-spot scam tactics is using **fake, stolen, or AI-generated product images** to make a fraudulent listing look legitimate. EchoWard's Foundry agent uses **GPT-4o Vision** to verify product images and catch this class of fraud before the user is deceived.

---

## 🎯 What This Agent Does

When the Scam Detector receives a product listing, it sends the image URL to this Foundry agent, which:

1. Analyzes the image against the product description
2. Detects signs of stock photo reuse, AI generation, or mismatched content
3. Returns a verdict: `authentic` / `suspicious` / `fake`
4. Provides a plain-language explanation that gets added to the scam alert

---

## 🔍 What GPT-4o Vision Looks For

| Signal | Description |
|---|---|
| Image-description mismatch | Product says "Sony WH-1000XM5" but image shows generic no-brand headphones |
| Stock photo indicators | Watermarks, white-background studio shots reused across multiple listings |
| AI-generated image artifacts | Unnatural textures, incorrect text on product labels, distorted logos |
| Counterfeit brand signals | Logo fonts, colors, or proportions don't match authentic branding |
| Multiple listings, same image | Same photo used for completely different product categories |

---

## 🛠️ Setup in Azure AI Foundry

### Step 1: Create a Foundry Project

1. Go to [https://ai.azure.com](https://ai.azure.com)
2. Select your hub (`echoward-rg`)
3. Create a project: `echoward-image-audit`

### Step 2: Deploy GPT-4o Vision

1. Go to **Model catalog** → search `gpt-4o`
2. Click **Deploy** → deployment name: `gpt-4o-vision`
3. Confirm availability in your region (East US or Sweden Central recommended)

### Step 3: Configure the System Prompt

In the Prompt Playground, test with this system prompt:

```
You are the Image Audit agent for EchoWard, an AI assistant that protects vulnerable users from online shopping scams.

Your job is to analyze a product image and determine whether it accurately represents the product being sold.

When given an image URL and product description:
1. Analyze the image carefully
2. Check for: stock photos, AI-generated artifacts, brand inconsistencies, mismatches with the description
3. Return a JSON response:
   {
     "verdict": "authentic" | "suspicious" | "fake",
     "confidence": "High" | "Medium" | "Low",
     "explanation": "One sentence in plain language explaining your finding"
   }

Examples of explanations:
- Authentic: "The image appears to be a genuine photo of the described product."
- Suspicious: "This looks like a stock photo that may be used across multiple listings."
- Fake: "The image shows a different brand than what is described in the listing."

Keep explanations under 15 words. Use plain, simple language — no technical jargon.
```

### Step 4: Create a Prompt Flow

1. Go to **Prompt flow** → **+ Create** → **Standard flow**
2. Add an **LLM node** using `gpt-4o-vision`

**Inputs:**
```yaml
image_url: string
product_description: string
```

**Outputs:**
```yaml
verdict: string        # "authentic" | "suspicious" | "fake"
confidence: string     # "High" | "Medium" | "Low"
explanation: string    # plain-language finding
```

### Step 5: Deploy as an Endpoint

1. Go to **Deployments** → **+ Create**
2. Select your prompt flow
3. Deploy as a **Managed online endpoint**
4. Save the **endpoint URL** and **API key** for Copilot Studio integration

### Step 6: Connect to Scam Detector

In Copilot Studio → Scam Detector → **Actions** → **+ Add an action**:
- Action type: HTTP
- URL: your Foundry endpoint URL
- Auth: API key header
- Map inputs: `image_url`, `product_description`
- Map outputs: `verdict`, `confidence`, `explanation`

**Scoring integration:**
```
if verdict == "fake": add +3 to risk score
if verdict == "suspicious": add +1 to risk score
if confidence == "Low": treat as one level lower
```

---

## ✅ Test Scenarios

| Input | Expected Verdict |
|---|---|
| Genuine Amazon product page image | authentic, High confidence |
| Generic white-background stock photo for a "branded" item | suspicious, Medium confidence |
| Image of a completely different product than described | fake, High confidence |
| Blurry or low-resolution image | suspicious, Low confidence |
