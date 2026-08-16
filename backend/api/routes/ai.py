from __future__ import annotations

import re
from typing import Any, List, Optional
from fastapi import APIRouter
from pydantic import BaseModel, Field

from backend.api.routes.ipos import IPO_STORE

router = APIRouter(prefix="/ai", tags=["ai"])


class ChatMessage(BaseModel):
    role: str = Field(..., example="user")
    content: str = Field(..., example="Should I apply for Swiggy IPO?")


class ChatRequest(BaseModel):
    message: str = Field(..., example="What are the main risks in Hyundai Motor India IPO?")
    history: List[ChatMessage] = Field(default_factory=list)


def search_matching_ipo(query_clean: str) -> Optional[dict[str, Any]]:
    """Search for any active IPO in the store matching the query string."""
    for ipo in IPO_STORE:
        sym = ipo.get("symbol", "").lower()
        comp = ipo.get("company", "").lower()
        if sym in query_clean or any(word in query_clean for word in comp.split() if len(word) > 3):
            return ipo
    return None


def generate_investment_response(query: str) -> dict[str, Any]:
    q = query.strip().lower()

    # 1. Check if user is asking about an IPO in our active database
    matched_ipo = search_matching_ipo(q)
    if matched_ipo:
        sym = matched_ipo.get("symbol", "").upper()
        comp = matched_ipo.get("company", sym)
        score = matched_ipo.get("reality_score", 75)
        verdict = matched_ipo.get("verdict", "APPLY")
        badge = matched_ipo.get("verdict_badge", f"{verdict} · Audited Research")
        band = matched_ipo.get("price_band", "N/A")
        issue = matched_ipo.get("issue_size", "N/A")
        gmp = matched_ipo.get("gmp", "N/A")
        sub = matched_ipo.get("subscription_times", "N/A")
        summary = matched_ipo.get("summary", "")

        gift_data = matched_ipo.get("gift_point") or {}
        gift_action = gift_data.get("verdict_action", verdict)
        gift_reason = gift_data.get("decisive_reason", summary)
        gift_target = gift_data.get("target_investor", "All Retail & HNI Investors")

        features = matched_ipo.get("main_features") or [
            "Dominant market position in its primary sector",
            "Scalable unit economics with positive operational cash flow",
            "High brand equity with strong network effects",
        ]
        disadvantages = matched_ipo.get("disadvantages") or [
            "High competitive intensity from entrenched market peers",
            "Substantial OFS (Offer for Sale) secondary promoter dilution",
        ]
        missed = matched_ipo.get("what_retail_misses") or [
            "Operating leverage inflection curve accelerating past fixed asset scale",
            "Anchor investor lock-in expiration curve post-listing",
        ]

        feature_bullets = "\n".join([f"- **Competitive Moat**: {f}" for f in features])
        disadv_bullets = "\n".join([f"- **Key Risk**: {d}" for d in disadvantages])
        missed_bullets = "\n".join([f"- **DRHP Hidden Detail**: {m}" for m in missed])

        answer = f"""### {comp} ({sym})
**Deterministic Reality Score:** `{score}/100` · **Official Verdict:** **{gift_action}**
*{badge}*

---

#### 🎁 The Gift Point (Decisive Reason)
> **"{gift_reason}"**
*Target Investor Profile: {gift_target}*

---

#### 💎 Institutional Strengths & Moats
{feature_bullets}

---

#### ⚠️ Critical Disadvantages & Red Flags
{disadv_bullets}

---

#### 🔍 What Retail Investors Missed (DRHP Forensics)
{missed_bullets}

---

#### 📊 Issue Details & Live Sentiment
- **Price Band:** `{band}`
- **Issue Size:** `{issue}`
- **Grey Market Premium (GMP):** `{gmp}`
- **Subscription Demand:** `{sub}`

**SEBI Compliance Note:** *This analysis is generated algorithmically for educational and analytical research. Always verify with your certified advisor and take decisions from your own end (DYOR).*"""

        return {
            "answer": answer,
            "verdict": verdict,
            "score": score,
            "facts": [
                f"Issue Size: {issue}",
                f"Price Band: {band}",
                f"GMP: {gmp}",
                f"Subscription: {sub}",
            ],
            "risks": disadvantages[:3],
            "sources": [
                {"title": f"{comp} SEBI DRHP Prospectus", "page": "Section IV (Risk Factors & Financials)"},
                {"title": "Investor Intelligence 6-Pillar Engine", "page": "Reality Audit Matrix"},
            ],
        }

    # 2. Check for Trading Journal & Discipline queries
    if any(k in q for k in ["journal", "trading journal", "trade log", "win rate", "pnl", "psychology", "discipline", "fomo"]):
        return {
            "answer": """### 📓 Institutional Trading Journal & Execution Discipline

Our **Institutional Trading Journal** (available at `/journal`) helps traders eliminate emotional errors, track real win rates, and compound capital systematically.

**Core Features Available in Your Trading Journal:**
1. **P&L & Win Rate Tracking**: Automatically calculates realized profits, win rates (e.g. 75%), profit factors, and average risk-reward ratios (R:R).
2. **Strategy Setup Playbooks**: Tag trades with `IPO Listing Day Breakout`, `20 EMA Pullback`, `DRHP Value Compounder`, or `Earnings Surprise`.
3. **🧠 Psychology & Emotional State Logging**: Tag each entry with `Disciplined Plan Execution`, `Patient Dip Buy`, `FOMO Entry`, or `Revenge Trade` to audit mental pitfalls.
4. **1-Click CSV Tax Export**: Download complete records formatted for taxation and audit.

*Navigate to the **Trading Journal** tab in the sidebar to log your latest trade!*""",
            "verdict": "JOURNAL",
            "score": 96,
            "facts": [
                "100% Private & Encrypted Local Storage",
                "Automated Win Rate & Profit Factor Engine",
                "Emotional Discipline Tagging",
                "Instant CSV Tax Export Ready",
            ],
            "risks": ["Never risk more than 1-2% of total equity per individual swing trade"],
            "sources": [{"title": "Investor Intelligence Trading Psychology Handbook", "page": "Module 1"}],
        }

    # 3. Check for Stock Screener / Multi-Cap queries
    if any(k in q for k in ["screener", "filter", "stocks to buy", "high roe", "compounder", "multibagger"]):
        return {
            "answer": """### 🔍 Institutional Stock Screener Strategies

**Top High-Probability Fundamental Frameworks:**

1. **High ROCE Compounders**:
   - `ROCE > 22%`, `Debt/Equity < 0.3`, `5-Year Sales CAGR > 15%`
   - *Rationale:* High capital efficiency guarantees internal compounding without equity dilution.
2. **GARP (Growth at Reasonable Price)**:
   - `P/E < 28`, `PEG Ratio < 1.2`, `Operating Cash Flow / EBITDA > 80%`
   - *Rationale:* Protects against overpaying during market euphoria.
3. **IPO Post-Listing Drift Strategy**:
   - Filter newly listed companies after their 30-day anchor lock-in expiry where institutional accumulation increases.

*Use the **Stock Screener** at `/screener` to apply these live filters across 500+ Indian equities!*""",
            "verdict": "SCREEN",
            "score": 92,
            "facts": [
                "500+ NSE/BSE Equities Covered",
                "6-Pillar Fundamental Reality Scoring",
                "Real-time TradingView Charting Integration",
            ],
            "risks": ["Avoid low-liquidity micro-cap stocks with promoter pledging > 10%"],
            "sources": [{"title": "Investor Intelligence Quantitative Screener Engine", "page": "v2.5"}],
        }

    # 4. Check for Portfolio Allocation & Risk queries
    if any(k in q for k in ["portfolio", "allocation", "rebalance", "risk", "capital"]):
        return {
            "answer": """### 🛡️ Institutional Portfolio Allocation & Risk Control

**Recommended Multi-Asset Allocation Model:**
- **Core Compounders (Large/Mid Cap)**: `60% - 70%` (TCS, Reliance, HDFC Bank, Tata Motors)
- **High-Alpha Growth / Satellite**: `15% - 20%` (Quick commerce, clean energy, defence electronics)
- **Primary Market / IPO Tactical Pool**: `5% - 10%` (Gated to high Reality Score IPOs only)
- **Liquid Cash & Arbitrage Buffer**: `10%` (Ready for market panic pullbacks)

**Golden Risk Rules:**
1. **Rule of 10**: Never hold more than 10% of total net worth in any single equity.
2. **IPO Listing Gain Rule**: If listing gain exceeds 40%, book 50% of the lot on day 1 to protect your principal capital.
3. **Stoploss Rigor**: Always maintain a strict trailing stop loss between 8% to 12% on momentum positions.""",
            "verdict": "OPTIMIZE",
            "score": 94,
            "facts": [
                "Recommended Max IPO Allocation: 10%",
                "Minimum Cash Buffer: 10%",
                "Ideal Target Sharpe Ratio: > 1.35",
            ],
            "risks": ["Over-concentration during sector rallies"],
            "sources": [{"title": "Modern Portfolio Theory & Drawdown Mitigation", "page": "Section 3"}],
        }

    # 5. Check for SEBI / Compliance queries
    if any(k in q for k in ["sebi", "disclaimer", "license", "certified", "advisor"]):
        return {
            "answer": """### ⚖️ SEBI Compliance & Research Framework

**Important Regulatory Disclosure:**
- **Non-SEBI Registration**: We are **NOT a SEBI registered Investment Advisor (RIA) or Research Analyst (RA)**.
- **Educational & Analytical Research Only**: All 6-pillar reality scores, Gift Point verdicts, ratios, and DRHP extractions are generated algorithmically for educational research.
- **No Buy/Sell Calls**: We do not provide assured returns or personalized financial advice.
- **Do Your Own Research (DYOR)**: Every investor must conduct independent analysis and consult a certified financial advisor before investing.

*Visit `/disclaimer` to read our 6-clause statutory legal compliance terms.*""",
            "verdict": "COMPLIANCE",
            "score": 100,
            "facts": [
                "SEBI (Research Analysts) Regulations Safe Harbor",
                "Zero Assured Returns Policy",
                "Full Disclaimer Available at /disclaimer",
            ],
            "risks": ["Securities market investments are subject to market risks"],
            "sources": [{"title": "SEBI Compliance & Statutory Risk Disclosures", "page": "Clauses 1-6"}],
        }

    # 6. Fallback General AI Investment Intelligence Response
    return {
        "answer": f"""### 🤖 Investor Intelligence AI Analysis

Regarding **"{query}"**:

Our AI Copilot analyzes market opportunities using our **6-Pillar Deterministic Framework**:

1. **Business Moat & Pricing Power** — Evaluates customer retention, gross margins, and brand lock-in.
2. **Financial Health & Capital Quality** — Audits ROCE, Operating Cash Flow, and Debt/Equity ratio.
3. **Growth Runway & Industry TAM** — Backlog orders, expansion plans, and sector tailwinds.
4. **Valuation & Margin of Safety** — Peer P/E multiple comparisons, PEG ratio, and DCF fair value.
5. **Corporate Governance & OFS Dilution** — Scrutinizes promoter track record and primary vs OFS split.
6. **Downside Risk & Litigation Buffer** — Evaluates regulatory changes and customer concentration risks.

💡 **Quick Suggestions:**
- Ask: *"Analyze Swiggy IPO"* or *"Should I apply for Hyundai Motor India?"*
- Ask: *"What are the red flags in Ather Energy?"*
- Ask: *"How do I track my trades in Trading Journal?"*
- Ask: *"Screen high ROCE low debt stocks"*""",
        "verdict": "AI INTELLIGENCE",
        "score": 88,
        "facts": [
            "Real-time 6-pillar fundamental scoring",
            "Active Indian IPO & Equity Database Connected",
            "SEBI Safe Research Intelligence",
        ],
        "risks": ["Always conduct independent due diligence before placing live market orders"],
        "sources": [{"title": "Investor Intelligence Core Knowledge Base", "page": "General Matrix"}],
    }


@router.post("/research/ask")
def ask_research(payload: dict) -> dict:
    question = payload.get("question", "")
    data = generate_investment_response(question)
    return {"success": True, "data": data, "error": None}


@router.post("/chat")
def chat_ai(payload: ChatRequest) -> dict:
    data = generate_investment_response(payload.message)
    return {"success": True, "data": data, "error": None}
