# EchoWard Orchestrator Agent

The orchestrator is the **main entry point** of EchoWard. It receives voice input converted to text by Azure Speech Services, classifies the user's intent, and routes to the appropriate child agent.

---

## 🎯 Responsibilities

- Accept speech-to-text input from the voice interface
- Classify user intent into one of:
  - `product_search` → Shopping Assistant
  - `scam_check` → Scam Detector
  - `accessibility_request` → Accessibility Guide
  - `image_description` → Visual Audit (Azure AI Foundry)
- Maintain conversation context across handoffs
- Deliver final responses back to the user via text-to-speech

---

## 🛠️ Setup in Copilot Studio

### Step 1: Create the Agent

1. Open [Microsoft Copilot Studio](https://copilotstudio.microsoft.com)
2. Click **+ Create** → **New agent**
3. Name: `EchoWard Orchestrator`
4. Language: English (add additional languages later)
5. Click **Create**

### Step 2: Configure Instructions

In the **Instructions** panel, paste the following system prompt:

```
You are EchoWard, a voice-first AI assistant that helps vulnerable users — including visually impaired and elderly people — shop safely online and detect scams in real time.

Your role is to:
1. Listen to the user's voice input (provided as text)
2. Understand their intent
3. Route to the appropriate specialist agent:
   - Shopping queries → Shopping Assistant
   - Scam or safety concerns → Scam Detector
   - Accessibility or navigation help → Accessibility Guide
   - Image or product verification → Visual Audit

Always respond in a calm, clear, and reassuring tone. Keep responses concise and easy to follow by voice.
Never share personal data. Always confirm high-risk actions with the user before proceeding.
```

### Step 3: Add Intent Classification Topic

1. Go to **Topics** → **+ Add a topic** → **From blank**
2. Name: `Intent Classifier`
3. Set as the **starting topic** (triggered on every new conversation)
4. Add trigger phrases:
   - "I want to buy"
   - "Find me a deal"
   - "Is this website safe"
   - "I need help"
   - "Describe this product"
5. Add a **Question** node: "What would you like to do today?"
6. Based on entity extraction, branch to the appropriate child agent handoff

### Step 4: Add Child Agent Connections

For each child agent (after creating them):

1. Go to **Topics** → select `Intent Classifier`
2. Add a **Redirect** node pointing to the child agent topic
3. Configure handoff conditions based on classified intent

---

## 🔗 Connections

| Child Agent | Trigger Intent |
|---|---|
| Shopping Assistant | `product_search`, `price_check`, `buy` |
| Scam Detector | `scam_check`, `safety`, `is_this_safe` |
| Accessibility Guide | `accessibility`, `help_navigate`, `font_size` |
| Visual Audit | `describe_image`, `verify_product` |

---

## ✅ Verification

Test your orchestrator with these phrases:

- "Find me headphones under 50 dollars" → should route to Shopping Assistant
- "Is this seller safe?" → should route to Scam Detector
- "Make the text bigger" → should route to Accessibility Guide
