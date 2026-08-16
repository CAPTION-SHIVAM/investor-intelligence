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
    order_id: Optional[str] = Field("order_8f93821a", example="order_8f93821a")
    payment_method: str = Field("UPI", example="UPI / Card / NetBanking")
    transaction_ref: Optional[str] = Field(None, example="423819283921")
    email: Optional[str] = Field(None, example="user@example.com")
    plan: Optional[str] = Field("PRO", example="PRO")
    billing_cycle: Optional[str] = Field("monthly", example="monthly")
    amount: Optional[float] = Field(299.0, example=299.0)
    is_free_coupon: Optional[bool] = Field(False, example=False)


class ApprovePaymentRequest(BaseModel):
    email: str = Field(..., example="user@example.com")
    decision: str = Field("APPROVE", example="APPROVE / REJECT")
    durationDays: Optional[int] = Field(30, example=30)
    reason: Optional[str] = Field(None, example="Invalid UTR / Payment not received")


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
@router.post("/submit-payment")
def verify_or_submit_payment(payload: VerifyPaymentRequest) -> dict:
    from backend.api.routes.auth import _load_users, _save_users
    from datetime import datetime, timedelta, timezone

    invoice_id = f"INV-2026-{uuid.uuid4().hex[:6].upper()}"
    clean_utr = (payload.transaction_ref or "").strip()
    is_free = payload.is_free_coupon or (payload.amount is not None and payload.amount == 0)

    users = _load_users()
    clean_email = (payload.email or "").strip().lower()

    target_user = None
    if clean_email:
        target_user = next((u for u in users if u["email"].lower() == clean_email), None)

    now = datetime.now(timezone.utc)
    target_plan = payload.plan or "PRO"
    days = 365 if payload.billing_cycle == "annual" else 30

    if is_free:
        # 100% Free Promo Pass -> Instant Activation
        if target_user:
            target_user["plan"] = target_plan
            target_user["paymentStatus"] = "VERIFIED"
            target_user["utrRef"] = clean_utr or f"FREE_{int(time.time())}"
            target_user["subscriptionStartDate"] = now.isoformat()
            target_user["subscriptionExpiresAt"] = (now + timedelta(days=days)).isoformat()
            target_user["isExpired"] = False
            _save_users(users)

        return {
            "success": True,
            "data": {
                "status": "PAID",
                "order_id": payload.order_id,
                "invoice_id": invoice_id,
                "payment_method": payload.payment_method,
                "transaction_ref": clean_utr or f"FREE_{int(time.time())}",
                "plan": target_plan,
                "activated_at": int(time.time()),
                "message": "Free pass activated successfully! Pro features unlocked.",
            },
            "error": None,
        }

    # Paid Subscription -> Set to PENDING VERIFICATION (DO NOT unlock PRO yet!)
    if target_user:
        target_user["paymentStatus"] = "PENDING"
        target_user["pendingPlan"] = target_plan
        target_user["pendingBillingCycle"] = payload.billing_cycle or "monthly"
        target_user["pendingAmount"] = payload.amount or 299.0
        target_user["utrRef"] = clean_utr
        target_user["paymentSubmittedAt"] = now.isoformat()
        _save_users(users)

    return {
        "success": True,
        "data": {
            "status": "PENDING",
            "order_id": payload.order_id,
            "invoice_id": invoice_id,
            "payment_method": payload.payment_method,
            "transaction_ref": clean_utr,
            "plan": target_plan,
            "submitted_at": int(time.time()),
            "message": "Payment reference submitted for verification. Pro access will be unlocked once approved by admin.",
        },
        "error": None,
    }


@router.post("/approve-payment")
def approve_payment(payload: ApprovePaymentRequest) -> dict:
    from backend.api.routes.auth import _load_users, _save_users
    from datetime import datetime, timedelta, timezone

    users = _load_users()
    clean_email = payload.email.strip().lower()
    user = next((u for u in users if u["email"].lower() == clean_email), None)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    now = datetime.now(timezone.utc)

    if payload.decision.upper() == "APPROVE":
        target_plan = user.get("pendingPlan") or "PRO"
        duration = payload.durationDays or 30
        user["plan"] = target_plan
        user["paymentStatus"] = "VERIFIED"
        user["subscriptionStartDate"] = now.isoformat()
        user["subscriptionExpiresAt"] = (now + timedelta(days=duration)).isoformat()
        user["isExpired"] = False
        user.pop("pendingPlan", None)
        user.pop("pendingAmount", None)
        user.pop("rejectionReason", None)
    else:
        user["plan"] = "FREE"
        user["paymentStatus"] = "REJECTED"
        user["rejectionReason"] = payload.reason or "Payment not received in bank statement / Invalid UTR"
        user.pop("pendingPlan", None)
        user.pop("pendingAmount", None)

    _save_users(users)
    safe_user = {k: v for k, v in user.items() if k != "password"}
    return {
        "success": True,
        "data": safe_user,
        "message": f"Payment {payload.decision.lower()}d successfully.",
    }


@router.get("/pending-payments")
def get_pending_payments() -> dict:
    from backend.api.routes.auth import _load_users

    users = _load_users()
    pending = [u for u in users if u.get("paymentStatus") == "PENDING"]
    safe_users = [{k: v for k, v in u.items() if k != "password"} for u in pending]
    return {
        "success": True,
        "data": safe_users,
    }

