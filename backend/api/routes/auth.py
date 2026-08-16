from __future__ import annotations

import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr, Field

router = APIRouter(prefix="/auth", tags=["auth"])

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"
USERS_FILE = DATA_DIR / "users.json"

# Pre-seeded accounts
DEFAULT_USERS: List[Dict[str, Any]] = [
    {
        "id": "usr_admin",
        "email": "admin@investoriq.in",
        "password": "admin123",
        "displayName": "Shivam Vishwakarma (Master Admin)",
        "initials": "SV",
        "role": "ADMIN",
        "plan": "INSTITUTIONAL",
        "joinedDate": "2026-08-01",
        "lastLogin": "2026-08-16",
        "utrRef": "UPI/ROOT/ADMIN999",
        "subscriptionStartDate": "2026-08-01T00:00:00.000Z",
        "subscriptionExpiresAt": "2099-12-31T23:59:59.000Z",
        "isExpired": False,
    },
    {
        "id": "usr_shivam",
        "email": "investor.shivam5049@gmail.com",
        "password": "password123",
        "displayName": "Shivam Vishwakarma",
        "initials": "SV",
        "role": "ADMIN",
        "plan": "PRO",
        "joinedDate": "2026-08-10",
        "lastLogin": "2026-08-16",
        "utrRef": "UPI/423188902144",
        "subscriptionStartDate": "2026-08-10T10:00:00.000Z",
        "subscriptionExpiresAt": "2026-09-09T10:00:00.000Z",
        "isExpired": False,
    },
    {
        "id": "usr_rajesh",
        "email": "rajesh.verma@quantfund.in",
        "password": "password123",
        "displayName": "Rajesh Verma",
        "initials": "RV",
        "role": "USER",
        "plan": "PRO",
        "joinedDate": "2026-08-12",
        "lastLogin": "2026-08-16",
        "utrRef": "UPI/423190823411",
        "subscriptionStartDate": "2026-08-12T10:00:00.000Z",
        "subscriptionExpiresAt": "2026-09-11T10:00:00.000Z",
        "isExpired": False,
    },
    {
        "id": "usr_priya",
        "email": "priya.sharma@investor.in",
        "password": "password123",
        "displayName": "Priya Sharma",
        "initials": "PS",
        "role": "USER",
        "plan": "FREE",
        "joinedDate": "2026-08-15",
        "lastLogin": "2026-08-16",
        "utrRef": "",
        "subscriptionStartDate": None,
        "subscriptionExpiresAt": None,
        "isExpired": False,
    },
]


def _load_users() -> List[Dict[str, Any]]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    if not USERS_FILE.exists():
        _save_users(DEFAULT_USERS)
        return DEFAULT_USERS
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            users = json.load(f)
            return users
    except Exception:
        return DEFAULT_USERS


def _save_users(users: List[Dict[str, Any]]) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    try:
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving users: {e}")


def _check_and_enforce_expiry(user: Dict[str, Any]) -> Dict[str, Any]:
    if user.get("role") == "ADMIN":
        return user

    expires_at_str = user.get("subscriptionExpiresAt")
    if not expires_at_str or user.get("plan") == "FREE":
        return user

    try:
        # Handle ISO strings
        expires_at = datetime.fromisoformat(expires_at_str.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        if now > expires_at:
            user["plan"] = "FREE"
            user["isExpired"] = True
    except Exception:
        pass
    return user


class RegisterBody(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: str
    password: str = Field(..., min_length=4)


class LoginBody(BaseModel):
    email: str
    password: str


class UpdatePlanBody(BaseModel):
    email: str
    plan: str  # 'FREE' | 'PRO' | 'INSTITUTIONAL'
    utrRef: Optional[str] = None
    durationDays: Optional[int] = 30


@router.post("/register")
def register_user(body: RegisterBody) -> Dict[str, Any]:
    users = _load_users()
    clean_email = body.email.strip().lower()

    # Check if user already exists
    existing = next((u for u in users if u["email"].lower() == clean_email), None)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please Sign In.",
        )

    # Determine initials
    parts = body.name.strip().split()
    initials = (parts[0][0] + (parts[1][0] if len(parts) > 1 else "")).upper() if parts else "U"

    is_admin = clean_email.startswith("admin@") or clean_email == "admin"
    now_iso = datetime.now(timezone.utc).isoformat()

    new_user: Dict[str, Any] = {
        "id": f"usr_{int(datetime.now().timestamp())}",
        "email": clean_email,
        "password": body.password,
        "displayName": body.name.strip(),
        "initials": initials,
        "role": "ADMIN" if is_admin else "USER",
        "plan": "PRO" if is_admin else "FREE",
        "joinedDate": datetime.now().strftime("%Y-%m-%d"),
        "lastLogin": datetime.now().strftime("%Y-%m-%d"),
        "utrRef": "",
        "subscriptionStartDate": now_iso if is_admin else None,
        "subscriptionExpiresAt": None,
        "isExpired": False,
    }

    users.append(new_user)
    _save_users(users)

    safe_user = {k: v for k, v in new_user.items() if k != "password"}
    return {
        "success": True,
        "data": {
            "user": safe_user,
            "token": f"bearer_{new_user['id']}",
            "message": "Account created successfully.",
        },
    }


@router.post("/login")
def login_user(body: LoginBody) -> Dict[str, Any]:
    users = _load_users()
    clean_email = body.email.strip().lower()
    clean_pass = body.password.strip()

    # Special master admin quick login check (e.g. username 'admin' and 'admin123')
    if (clean_email == "admin" or clean_email == "admin@investoriq.in" or clean_email == "admin@investorintelligence.com") and (clean_pass in ["admin123", "admin@123", "password123"]):
        admin_user = next((u for u in users if u.get("role") == "ADMIN"), DEFAULT_USERS[0])
        admin_user["lastLogin"] = datetime.now().strftime("%Y-%m-%d")
        _save_users(users)
        safe_user = {k: v for k, v in admin_user.items() if k != "password"}
        return {
            "success": True,
            "data": {
                "user": safe_user,
                "token": f"bearer_{admin_user.get('id', 'admin')}",
                "message": "Welcome back Master Admin!",
            },
        }

    # Standard database lookup
    matched_user = next((u for u in users if u["email"].lower() == clean_email), None)

    if not matched_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account not found. Please check your email or click Create Account.",
        )

    if matched_user.get("password") != clean_pass:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Please try again.",
        )

    # Check 1-month expiration
    matched_user = _check_and_enforce_expiry(matched_user)
    matched_user["lastLogin"] = datetime.now().strftime("%Y-%m-%d")
    _save_users(users)

    safe_user = {k: v for k, v in matched_user.items() if k != "password"}
    return {
        "success": True,
        "data": {
            "user": safe_user,
            "token": f"bearer_{matched_user['id']}",
            "message": "Signed in successfully.",
        },
    }


@router.get("/users")
def get_all_users() -> Dict[str, Any]:
    users = _load_users()
    # Check expiry for all users
    updated_users = [_check_and_enforce_expiry(u) for u in users]
    _save_users(updated_users)

    safe_users = [{k: v for k, v in u.items() if k != "password"} for u in updated_users]
    return {
        "success": True,
        "data": safe_users,
    }


@router.post("/update-plan")
def update_user_plan(body: UpdatePlanBody) -> Dict[str, Any]:
    users = _load_users()
    clean_email = body.email.strip().lower()

    user = next((u for u in users if u["email"].lower() == clean_email), None)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user["plan"] = body.plan
    now = datetime.now(timezone.utc)

    if body.plan in ["PRO", "INSTITUTIONAL"]:
        duration = body.durationDays or 30
        user["subscriptionStartDate"] = now.isoformat()
        user["subscriptionExpiresAt"] = (now + timedelta(days=duration)).isoformat()
        user["isExpired"] = False
        if body.utrRef:
            user["utrRef"] = body.utrRef
    else:
        user["plan"] = "FREE"
        user["isExpired"] = True

    _save_users(users)
    safe_user = {k: v for k, v in user.items() if k != "password"}
    return {
        "success": True,
        "data": safe_user,
        "message": f"Plan updated to {body.plan} successfully.",
    }


@router.post("/delete-user")
def delete_user(body: Dict[str, str]) -> Dict[str, Any]:
    email = body.get("email", "").strip().lower()
    users = _load_users()
    filtered = [u for u in users if u["email"].lower() != email]

    if len(filtered) == len(users):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    _save_users(filtered)
    return {
        "success": True,
        "message": f"User {email} removed from system.",
    }
