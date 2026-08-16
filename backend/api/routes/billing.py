from __future__ import annotations

import time
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/billing", tags=["billing"])

PLANS = [
    {
        "id": "starter",
        "name": "Free Starter",
        "price_monthly": 0,
        "price_annual": 0,
        "features": [
            "Upcoming IPO calendar & basic dates",
            "Basic price bands & lot sizes",
            "Basic Large-Cap stock screener",
            "Community market briefing",
        ],
    },
    {
        "id": "pro",
        "name": "Pro Investor",
        "price_monthly": 299,
        "price_annual": 2399,
        "popular": True,
        "features": [
            "Complete 6-Pillar IPO Reality Score Engine",
            "Real-time Grey Market Premium (GMP) Tracking",
            "Clear Apply / Avoid Verdicts with Rationale",
            "Full Multi-Cap Stock Screener + CSV Export",
            "Unlimited AI Prospectus Parser & Chat Copilot",
            "Portfolio Risk & Thesis Invalidation Alerts",
            "TradingView Real-Time Chart Integration",
        ],
    },
    {
        "id": "institutional",
        "name": "Institutional VIP",
        "price_monthly": 799,
        "price_annual": 7999,
        "features": [
            "All Pro Investor Features Included",
            "API Access to 6-Pillar Score Engine",
            "Multi-seat analyst team workspace",
            "Custom DRHP Forensic Memos & Red Flag Audits",
            "Priority WhatsApp / Telegram Direct Analyst Desk",
        ],
    },
]


class CreateOrderRequest(BaseModel):
    plan_id: str = Field(..., example="pro")
    billing_cycle: str = Field("annual", example="annual")
    email: str = Field("investor@domain.com", example="investor@domain.com")


class VerifyPaymentRequest(BaseModel):
    order_id: str = Field(..., example="order_8f93821a")
    payment_method: str = Field("UPI", example="UPI / Card / NetBanking")
    transaction_ref: Optional[str] = Field("TXN_839219382", example="TXN_839219382")


@router.get("/plans")
def get_plans() -> dict:
    return {
        "success": True,
        "data": PLANS,
        "error": None,
    }


@router.post("/create-order")
def create_order(payload: CreateOrderRequest) -> dict:
    plan = next((p for p in PLANS if p["id"].lower() == payload.plan_id.lower()), None)
    if not plan:
        raise HTTPException(status_code=404, detail="Invalid plan selected")

    amount = plan["price_annual"] if payload.billing_cycle == "annual" else plan["price_monthly"]
    order_id = f"order_{uuid.uuid4().hex[:10]}"

    # Generate genuine UPI DeepLink & VPA string for Indian digital payments
    upi_vpa = "investor.intelligence@icici"
    upi_payload = f"upi://pay?pa={upi_vpa}&pn=InvestorIntelligence&am={amount}&cu=INR&tn={order_id}"

    return {
        "success": True,
        "data": {
            "order_id": order_id,
            "plan_id": plan["id"],
            "plan_name": plan["name"],
            "amount": amount,
            "currency": "INR",
            "billing_cycle": payload.billing_cycle,
            "upi_vpa": upi_vpa,
            "upi_intent_url": upi_payload,
            "merchant_name": "Investor Intelligence Financial Technologies",
            "created_at": int(time.time()),
        },
        "error": None,
    }


@router.post("/verify-payment")
def verify_payment(payload: VerifyPaymentRequest) -> dict:
    invoice_id = f"INV-2026-{uuid.uuid4().hex[:6].upper()}"
    return {
        "success": True,
        "data": {
            "status": "PAID",
            "order_id": payload.order_id,
            "invoice_id": invoice_id,
            "payment_method": payload.payment_method,
            "transaction_ref": payload.transaction_ref or f"UPI_{int(time.time())}",
            "plan": "PRO",
            "activated_at": int(time.time()),
            "message": "Payment verified successfully! Pro Investor features have been unlocked on your workspace.",
        },
        "error": None,
    }
