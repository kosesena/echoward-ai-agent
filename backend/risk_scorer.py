"""
EchoWard — Scam Risk Scorer
============================
Core risk scoring logic for the Scam Detector agent.
This module mirrors the Power Automate / Azure Function logic
and can be used for local testing or as a reference implementation.

Usage:
    python risk_scorer.py

Or import:
    from risk_scorer import score_product, RiskLevel
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


@dataclass
class ProductInput:
    """Input schema for the risk scorer — mirrors the Copilot Studio action input."""
    product_name: str
    listed_price: float
    market_avg_price: float
    seller_name: str
    seller_age_days: int
    review_count: int
    has_return_policy: bool
    product_url: str
    image_authentic: bool = True
    image_note: Optional[str] = None


@dataclass
class RiskResult:
    """Output schema returned to the Copilot Studio agent."""
    risk_level: RiskLevel
    score: int
    reasons: list[str] = field(default_factory=list)
    recommendation: str = ""
    echoward_voice_alert: str = ""


def score_product(product: ProductInput) -> RiskResult:
    """
    Score a product listing for fraud risk.
    Returns a RiskResult with level, score, and plain-language reasons.
    """
    score = 0
    reasons = []

    # --- Price anomaly ---
    if product.market_avg_price > 0:
        price_drop = (product.market_avg_price - product.listed_price) / product.market_avg_price
        if price_drop > 0.80:
            score += 3
            reasons.append(
                f"Price is {round(price_drop * 100)}% below market average "
                f"(€{product.listed_price:.2f} vs. normal €{product.market_avg_price:.2f}). "
                "This is extremely unusual for a legitimate seller."
            )
        elif price_drop > 0.70:
            score += 2
            reasons.append(
                f"Price is {round(price_drop * 100)}% below market average. "
                "Legitimate sellers almost never discount this much."
            )
        elif price_drop > 0.50:
            score += 1
            reasons.append(
                f"Price is {round(price_drop * 100)}% below market average — worth checking."
            )

    # --- Seller age ---
    if product.seller_age_days < 7:
        score += 2
        reasons.append(
            f"This seller account was created only {product.seller_age_days} day(s) ago. "
            "Legitimate businesses build their reputation over time."
        )
    elif product.seller_age_days < 30:
        score += 1
        reasons.append(
            f"This seller account is only {product.seller_age_days} days old."
        )

    # --- Reviews ---
    if product.review_count == 0:
        score += 1
        reasons.append("This seller has zero customer reviews.")
    elif product.review_count < 10:
        score += 1
        reasons.append(
            f"This seller has only {product.review_count} review(s) — very limited history."
        )

    # --- Return policy ---
    if not product.has_return_policy:
        score += 1
        reasons.append("This seller has no return or refund policy.")

    # --- URL check (basic heuristics) ---
    suspicious_url_signals = [
        ".xyz", ".shop", ".online", ".click", "-deals.", "-outlet.", "-clearance.",
        "0" in product.product_url.split("/")[2] if "/" in product.product_url else False,
    ]
    if any(s and isinstance(s, str) and s in product.product_url for s in suspicious_url_signals):
        score += 2
        reasons.append(
            "This website address has suspicious patterns. "
            "Scammers often create fake websites that look similar to trusted stores."
        )

    # --- Image authenticity (GPT-4o Vision result) ---
    if not product.image_authentic:
        score += 3
        note = product.image_note or "Product image does not match the description."
        reasons.append(note + " This is a common sign of a counterfeit listing.")

    # --- Map score to risk level ---
    if score >= 6:
        risk_level = RiskLevel.CRITICAL
    elif score >= 4:
        risk_level = RiskLevel.HIGH
    elif score >= 2:
        risk_level = RiskLevel.MEDIUM
    else:
        risk_level = RiskLevel.LOW

    # --- Add safe confirmation for low risk ---
    if risk_level == RiskLevel.LOW:
        reasons.append(
            f"Verified seller — {product.seller_age_days} days active, "
            f"{product.review_count:,} reviews."
        )

    # --- Generate recommendation ---
    recommendation = {
        RiskLevel.LOW: "This listing appears safe. Safe to proceed.",
        RiskLevel.MEDIUM: "Minor concerns detected. Proceed with caution.",
        RiskLevel.HIGH: "Significant risk signals detected. We recommend choosing a safer option.",
        RiskLevel.CRITICAL: "Multiple serious fraud signals detected. We strongly recommend NOT purchasing from this seller.",
    }[risk_level]

    # --- Generate EchoWard voice alert ---
    voice_alert = _build_voice_alert(product.product_name, risk_level, reasons)

    return RiskResult(
        risk_level=risk_level,
        score=score,
        reasons=reasons,
        recommendation=recommendation,
        echoward_voice_alert=voice_alert,
    )


def _build_voice_alert(product_name: str, risk: RiskLevel, reasons: list[str]) -> str:
    """Build the plain-language voice alert that EchoWard speaks to the user."""
    if risk == RiskLevel.LOW:
        return f"{product_name} looks safe. {reasons[0]}"

    if risk == RiskLevel.MEDIUM:
        return (
            f"Just a heads up about {product_name}: {reasons[0]} "
            "You can still proceed if you'd like."
        )

    if risk == RiskLevel.HIGH:
        reasons_text = " ".join(reasons[:2])
        return (
            f"Warning: {product_name} has been flagged as HIGH RISK. "
            f"{reasons_text} "
            "Would you like to skip this one?"
        )

    if risk == RiskLevel.CRITICAL:
        reasons_text = " ".join(reasons[:3])
        return (
            f"Critical warning: {product_name} has been flagged as CRITICALLY RISKY. "
            f"{reasons_text} "
            "I strongly recommend not purchasing from this seller. "
            "Say YES if you still want to proceed, or NO to go back."
        )

    return ""


# =============================================
# Demo / Test Runner
# =============================================

if __name__ == "__main__":
    test_cases = [
        ProductInput(
            product_name="Sony WH-CH510 Wireless Headphones",
            listed_price=34.99,
            market_avg_price=39.99,
            seller_name="SonyOfficialStore",
            seller_age_days=1460,
            review_count=4821,
            has_return_policy=True,
            product_url="https://www.amazon.com/dp/B07YGZ7GSQ",
            image_authentic=True,
        ),
        ProductInput(
            product_name="Generic Bluetooth Speaker XL",
            listed_price=19.99,
            market_avg_price=24.00,
            seller_name="TechBargainShop",
            seller_age_days=28,
            review_count=12,
            has_return_policy=False,
            product_url="https://www.techbargains-store.com/speaker-xl",
            image_authentic=True,
        ),
        ProductInput(
            product_name="Samsung Galaxy Watch 5 — Limited Deal",
            listed_price=49.99,
            market_avg_price=249.00,
            seller_name="FlashSaleHub",
            seller_age_days=11,
            review_count=3,
            has_return_policy=False,
            product_url="https://www.samsung-deals-outlet.net/watch5",
            image_authentic=False,
            image_note="Image shows an unbranded watch — not Samsung Galaxy Watch 5",
        ),
        ProductInput(
            product_name="Apple AirPods Pro 2nd Gen — Clearance",
            listed_price=29.99,
            market_avg_price=199.00,
            seller_name="AppleDeals99",
            seller_age_days=6,
            review_count=1,
            has_return_policy=False,
            product_url="https://www.apple-clearance-eu.shop/airpods",
            image_authentic=False,
            image_note="Low-quality copy of Apple's official marketing photo",
        ),
    ]

    print("=" * 60)
    print("EchoWard — Risk Scorer Test Run")
    print("=" * 60)

    for product in test_cases:
        result = score_product(product)
        print(f"\nProduct: {product.product_name}")
        print(f"Price:   €{product.listed_price:.2f} (market avg: €{product.market_avg_price:.2f})")
        print(f"Risk:    {result.risk_level.value} (score: {result.score})")
        print(f"Alert:   {result.echoward_voice_alert[:120]}...")
        print("-" * 60)
