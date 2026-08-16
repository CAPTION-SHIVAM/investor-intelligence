from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class CompanyOut(BaseModel):
    id: int
    name: str
    symbol: str
    exchange: str
    sector: Optional[str] = None
    industry: Optional[str] = None
    market_cap: Optional[float] = None


class IPOOut(BaseModel):
    id: int
    name: str
    issue_price_lower: Optional[float] = None
    issue_price_upper: Optional[float] = None
    issue_size: Optional[float] = None
    status: str
    score: Optional[float] = None


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TradeImportItem(BaseModel):
    date: datetime
    symbol: str
    side: str
    quantity: float
    price: float
    fees: float = 0.0
    trade_value: float


class ThesisAssumptionCreate(BaseModel):
    metric: str
    operator: str
    target_value: float
    actual_value: Optional[float] = None
    source: Optional[str] = None


class ThesisCreate(BaseModel):
    company_id: int
    title: str
    thesis_text: str
    assumptions: list[ThesisAssumptionCreate] = []


class DemoResponse(BaseModel):
    success: bool = True
    data: dict
    error: Optional[dict] = None
