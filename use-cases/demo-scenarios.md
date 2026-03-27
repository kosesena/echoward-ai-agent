# EchoWard — Demo Scenarios

These scenarios are designed for the hackathon pitch. Each one focuses on **scam detection** — EchoWard's core problem.

---

## Scenario 1: Critical Risk — Counterfeit Listing (Main Demo)

**User profile:** Elderly woman, 72 years old, wants to buy a gift

**Goal:** Demonstrate the full scam detection flow — search, parallel analysis, HITL alert

```
User:      "I want to buy headphones for my grandson. Under 50 euros."

EchoWard:  "I'll search for headphones under 50 euros and check each one for safety."

           [Shopping Assistant retrieves 3 results]
           [Scam Detector analyzes all 3 in parallel — ~3 seconds]

EchoWard:  "I found 3 options. Here's what I found:

            Option 1: Sony WH-CH510, 35 euros. Safe seller — 2 years active,
            over 400 reviews. ✅

            Option 2: Brand headphones, 8 euros.
            ⚠️ WARNING — this listing has been flagged as CRITICALLY RISKY.
            This price is 84% below what headphones like this normally cost.
            The seller account was created 4 days ago with zero reviews.
            The product image does not match the description.
            I strongly recommend not purchasing from this seller.
            Say YES if you still want to consider it, or NO to skip it.

            User:      "No."

EchoWard:  "Skipped. Option 3: JBL Tune 510BT, 38 euros. Safe seller —
            1 year active, 200 reviews. ✅

            Would you like option 1 or option 3?"

User:      "Option 1."

EchoWard:  "Great choice. I'll guide you through the purchase step by step."
```

**What to highlight:**
- Parallel scam analysis running while results load
- Critical risk alert with specific, plain-language reasons
- HITL confirmation pause
- User maintains full control

---

## Scenario 2: Suspicious URL Detection

**User profile:** Visually impaired man, 55 years old

**Goal:** Show URL-based phishing detection

```
User:      "Find me running shoes under 80 euros."

EchoWard:  "Searching... I found 3 options. Checking each one for safety."

EchoWard:  "Option 1: Adidas Runfalcon 3, 65 euros. Safe. ✅

            Option 2: Nike Air Max, 49 euros — from nike-outlet-deals.xyz.
            ⚠️ HIGH RISK. This website address looks very similar to Nike's
            official website but is not the real Nike store. This is a common
            tactic used by scammers to steal payment information.
            I recommend skipping this one. Do you want to proceed anyway?

User:      "No, skip it."

EchoWard:  "Skipped. Option 3: New Balance 520, 72 euros. Safe. ✅

            Would you like option 1 or option 3?"
```

**What to highlight:**
- URL pattern analysis (homograph / typosquatting detection)
- Azure Content Safety integration
- Plain-language explanation a non-technical user can understand

---

## Scenario 3: Image Fraud Detection (Azure AI Foundry)

**User profile:** Elderly user looking for a smartwatch

**Goal:** Demonstrate GPT-4o Vision catching fake product images

```
User:      "I'd like to buy a smartwatch. My budget is 100 euros."

EchoWard:  "Searching for smartwatches under 100 euros..."

EchoWard:  "I found 2 options.

            Option 1: Samsung Galaxy Watch, 95 euros.
            ⚠️ One concern with this listing: the product image shows a
            generic, unbranded watch — not a Samsung. This is a sign
            the listing may not be genuine.
            Risk level: High. Would you like to skip this one?

User:      "Yes, skip it."

EchoWard:  "Option 2: Garmin Vivoactive 4S, 89 euros. Safe seller,
            image matches the product description. ✅
            Would you like to go with this one?"

User:      "Yes."
```

**What to highlight:**
- GPT-4o Vision used in real time on product images
- Image mismatch detected and explained simply
- User doesn't need to see the image — EchoWard describes the finding by voice

---

## Scenario 4: Safe Purchase (No Scam — for Contrast)

**User profile:** Any user

**Goal:** Show EchoWard is not overly cautious — safe listings flow smoothly

```
User:      "Find me a book about gardening."

EchoWard:  "Searching... I found 3 options. Checking safety."

EchoWard:  "All 3 options look safe. Here they are:

            Option 1: The Vegetable Gardener's Bible, 14 euros.
            Option 2: RHS How to Garden, 12 euros.
            Option 3: Complete Gardening Manual, 16 euros.

            Which one would you like?"
```

**What to highlight:**
- When listings are safe, EchoWard doesn't interrupt or alarm the user unnecessarily
- The safety check is silent and fast when results are clean
- Demonstrates the system is calibrated — not a false alarm machine

---

## Quick Test Phrases

| Phrase | Expected Behavior |
|---|---|
| "Find me a phone under 50 euros" | 3 results, at least 1 scam signal likely triggered |
| "Is this seller safe?" | Scam Detector manual check |
| "That price seems too good to be true" | Triggers price anomaly check |
| "What's wrong with option 2?" | Repeats the risk reasons for that listing |
| "Skip it" | Removes flagged listing, continues with safe options |
| "I want to proceed anyway" | Logs override, allows transaction with warning |
