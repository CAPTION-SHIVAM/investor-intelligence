from __future__ import annotations

import json
import os
from typing import Any, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from backend.providers.market_data_provider import MockMarketDataProvider
from backend.services.ipo_score_service import IPOScoreService

router = APIRouter(prefix="/ipos", tags=["ipos"])
provider = MockMarketDataProvider()
scorer = IPOScoreService()

# In-memory dynamic IPO store initialized from provider
IPO_STORE: list[dict[str, Any]] = provider.get_ipo_data()


class IPOCreateUpdateRequest(BaseModel):
    symbol: str = Field(..., example="TECHCORP")
    company: str = Field(..., example="TechCorp Solutions Ltd")
    type: str = Field("Mainboard", example="Mainboard")
    status: str = Field("OPEN", example="OPEN")
    price_band: str = Field("₹450 - ₹480", example="₹450 - ₹480")
    issue_size: str = Field("₹2,500 Cr", example="₹2,500 Cr")
    lot_size: int = Field(30, example=30)
    open_date: str = Field("2026-08-20", example="2026-08-20")
    close_date: str = Field("2026-08-24", example="2026-08-24")
    listing_date: str = Field("2026-08-30", example="2026-08-30")
    gmp: str = Field("₹45 (+10.0%)", example="₹45 (+10.0%)")
    gmp_pct: float = Field(10.0, example=10.0)
    subscription_times: str = Field("3.2x", example="3.2x")
    qib_sub: str = Field("5.1x", example="5.1x")
    nii_sub: str = Field("2.4x", example="2.4x")
    retail_sub: str = Field("1.8x", example="1.8x")
    reality_score: int = Field(82, example=82)
    verdict: str = Field("APPLY", example="APPLY")
    verdict_badge: str = Field("Apply · High Growth Market Leader", example="Apply · High Growth Market Leader")
    summary: str = Field("Fast growing enterprise provider with strong ROCE and cash flow.", example="Summary")
    gift_point: Optional[dict[str, str]] = None
    main_features: Optional[list[str]] = None
    disadvantages: Optional[list[str]] = None
    what_retail_misses: Optional[list[str]] = None
    business_model: Optional[dict[str, Any]] = None
    pillars: Optional[dict[str, int]] = None


class IPOAnalysisRequest(BaseModel):
    company_name: str = Field(..., example="Apex Cloud Tech")
    revenue_growth_pct: float = Field(25.0, example=32.5)
    net_margin_pct: float = Field(15.0, example=18.0)
    ebitda_margin_pct: float = Field(20.0, example=24.0)
    roce_pct: float = Field(18.0, example=22.0)
    debt_to_equity: float = Field(0.5, example=0.3)
    price_to_earnings: float = Field(28.0, example=35.0)
    peer_pe: float = Field(25.0, example=30.0)
    promoter_holding_pct: float = Field(65.0, example=72.0)
    promoter_pledge_pct: float = Field(0.0, example=0.0)
    customer_concentration_pct: float = Field(20.0, example=18.0)
    litigation_risk_scale: float = Field(1.0, example=1.0)
    industry_risk_scale: float = Field(1.0, example=1.0)


@router.get("")
def list_ipos(
    status: Optional[str] = Query(None, description="Filter by status: OPEN, UPCOMING, LISTED"),
    ipo_type: Optional[str] = Query(None, alias="type", description="Filter by type: Mainboard, SME"),
    min_score: Optional[int] = Query(None, description="Minimum Reality Score"),
    verdict: Optional[str] = Query(None, description="Filter by verdict: APPLY, NEUTRAL, AVOID, SPECULATIVE, HOLD"),
) -> dict:
    items = list(IPO_STORE)

    if status:
        items = [i for i in items if i.get("status", "").upper() == status.upper()]
    if ipo_type:
        items = [i for i in items if i.get("type", "").upper() == ipo_type.upper()]
    if min_score is not None:
        items = [i for i in items if int(i.get("reality_score", 0)) >= min_score]
    if verdict:
        items = [i for i in items if verdict.upper() in i.get("verdict", "").upper()]

    return {
        "success": True,
        "total": len(items),
        "data": items,
        "error": None,
    }


@router.post("")
def create_ipo(payload: IPOCreateUpdateRequest) -> dict:
    """Master Admin API: Create/Add a new IPO to the platform."""
    ipo_id = f"ipo-{payload.symbol.lower()}"

    # Check if already exists
    existing = next((i for i in IPO_STORE if i["id"] == ipo_id or i["symbol"].upper() == payload.symbol.upper()), None)
    if existing:
        raise HTTPException(status_code=400, detail="IPO with this symbol already exists")

    new_ipo = {
        "id": ipo_id,
        "symbol": payload.symbol.upper(),
        "company": payload.company,
        "type": payload.type,
        "status": payload.status.upper(),
        "price_band": payload.price_band,
        "issue_size": payload.issue_size,
        "lot_size": payload.lot_size,
        "open_date": payload.open_date,
        "close_date": payload.close_date,
        "listing_date": payload.listing_date,
        "gmp": payload.gmp,
        "gmp_pct": payload.gmp_pct,
        "subscription_times": payload.subscription_times,
        "qib_sub": payload.qib_sub,
        "nii_sub": payload.nii_sub,
        "retail_sub": payload.retail_sub,
        "reality_score": payload.reality_score,
        "verdict": payload.verdict,
        "verdict_type": "success" if payload.reality_score >= 80 else ("warning" if payload.reality_score >= 65 else "danger"),
        "verdict_badge": payload.verdict_badge,
        "summary": payload.summary,
        "gift_point": payload.gift_point or {
            "verdict_action": f"{payload.verdict} (NEW ISSUE)",
            "decisive_reason": payload.summary,
            "target_investor": "Growth & Primary Market Investors",
        },
        "main_features": payload.main_features or ["Solid market opportunity and business runway"],
        "disadvantages": payload.disadvantages or ["Market price volatility and competitive landscape"],
        "what_retail_misses": payload.what_retail_misses or ["Anchor investor lock-in expiry and promoter shareholding structure"],
        "business_model": payload.business_model or {
            "how_it_works": payload.summary,
            "revenue_breakdown": ["Core Product & Operations: 100%"],
            "unit_economics": "Healthy operating margin profile.",
        },
        "pillars": payload.pillars or {
            "business_moat": payload.reality_score,
            "financial_health": payload.reality_score,
            "growth_trajectory": payload.reality_score,
            "valuation_attractiveness": payload.reality_score,
            "management_governance": payload.reality_score,
            "risk_containment": payload.reality_score,
        },
    }

    IPO_STORE.insert(0, new_ipo)

    return {
        "success": True,
        "message": f"IPO {payload.symbol} added successfully to platform database.",
        "data": new_ipo,
        "error": None,
    }


@router.put("/{ipo_id}")
def update_ipo(ipo_id: str, payload: IPOCreateUpdateRequest) -> dict:
    """Master Admin API: Edit/Update an existing IPO."""
    found_idx = next(
        (idx for idx, item in enumerate(IPO_STORE) if item.get("id", "").lower() == ipo_id.lower() or item.get("symbol", "").lower() == ipo_id.lower()),
        None,
    )
    if found_idx is None:
        raise HTTPException(status_code=404, detail="IPO not found")

    existing = IPO_STORE[found_idx]
    updated = {
        **existing,
        "symbol": payload.symbol.upper(),
        "company": payload.company,
        "type": payload.type,
        "status": payload.status.upper(),
        "price_band": payload.price_band,
        "issue_size": payload.issue_size,
        "lot_size": payload.lot_size,
        "open_date": payload.open_date,
        "close_date": payload.close_date,
        "listing_date": payload.listing_date,
        "gmp": payload.gmp,
        "gmp_pct": payload.gmp_pct,
        "subscription_times": payload.subscription_times,
        "qib_sub": payload.qib_sub,
        "nii_sub": payload.nii_sub,
        "retail_sub": payload.retail_sub,
        "reality_score": payload.reality_score,
        "verdict": payload.verdict,
        "verdict_type": "success" if payload.reality_score >= 80 else ("warning" if payload.reality_score >= 65 else "danger"),
        "verdict_badge": payload.verdict_badge,
        "summary": payload.summary,
    }

    if payload.gift_point:
        updated["gift_point"] = payload.gift_point
    if payload.main_features:
        updated["main_features"] = payload.main_features
    if payload.disadvantages:
        updated["disadvantages"] = payload.disadvantages
    if payload.what_retail_misses:
        updated["what_retail_misses"] = payload.what_retail_misses
    if payload.business_model:
        updated["business_model"] = payload.business_model
    if payload.pillars:
        updated["pillars"] = payload.pillars

    IPO_STORE[found_idx] = updated

    return {
        "success": True,
        "message": f"IPO {payload.symbol} updated successfully.",
        "data": updated,
        "error": None,
    }


@router.delete("/{ipo_id}")
def delete_ipo(ipo_id: str) -> dict:
    """Master Admin API: Delete an IPO from the platform."""
    found_idx = next(
        (idx for idx, item in enumerate(IPO_STORE) if item.get("id", "").lower() == ipo_id.lower() or item.get("symbol", "").lower() == ipo_id.lower()),
        None,
    )
    if found_idx is None:
        raise HTTPException(status_code=404, detail="IPO not found")

    deleted = IPO_STORE.pop(found_idx)

    return {
        "success": True,
        "message": f"IPO {deleted.get('symbol')} deleted successfully.",
        "error": None,
    }


@router.get("/{ipo_id}")
def get_ipo(ipo_id: str) -> dict:
    found = next(
        (
            item for item in IPO_STORE
            if item.get("id", "").lower() == ipo_id.lower()
            or item.get("symbol", "").lower() == ipo_id.lower()
            or str(item.get("company", "")).lower() == ipo_id.lower()
        ),
        None,
    )
    if not found:
        raise HTTPException(status_code=404, detail="IPO not found")
    return {"success": True, "data": found, "error": None}


@router.post("/analyze")
def analyze_custom_ipo(payload: IPOAnalysisRequest) -> dict:
    business = scorer.calculate_business_score(payload.revenue_growth_pct, payload.customer_concentration_pct)
    financial = scorer.calculate_financial_score(payload.net_margin_pct, payload.roce_pct, payload.debt_to_equity)
    growth = scorer.calculate_growth_score(payload.revenue_growth_pct, payload.ebitda_margin_pct)
    valuation = scorer.calculate_valuation_score(payload.price_to_earnings, payload.peer_pe)
    management = scorer.calculate_management_score(payload.promoter_holding_pct, payload.promoter_pledge_pct)
    risk = scorer.calculate_risk_score(payload.debt_to_equity, payload.litigation_risk_scale, payload.industry_risk_scale)

    overall = round(
        business * 0.20
        + financial * 0.20
        + growth * 0.15
        + valuation * 0.20
        + management * 0.10
        + risk * 0.15,
        1,
    )

    if overall >= 80:
        verdict = "APPLY"
        badge = "High Conviction Apply - Strong Fundamentals"
    elif overall >= 65:
        verdict = "NEUTRAL"
        badge = "Moderate Conviction - Consider for Listing Gains Only"
    else:
        verdict = "AVOID"
        badge = "Avoid / High Risk - Weak Margins or Stretched Valuation"

    return {
        "success": True,
        "data": {
            "company": payload.company_name,
            "overall_score": overall,
            "verdict": verdict,
            "verdict_badge": badge,
            "pillars": {
                "business_moat": round(business, 1),
                "financial_health": round(financial, 1),
                "growth_trajectory": round(growth, 1),
                "valuation_attractiveness": round(valuation, 1),
                "management_governance": round(management, 1),
                "risk_containment": round(risk, 1),
            },
        },
        "error": None,
    }
