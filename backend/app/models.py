from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from backend.app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="USER", nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    symbol: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    exchange: Mapped[str] = mapped_column(String(50), default="NSE")
    sector: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    market_cap: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class IPO(Base):
    __tablename__ = "ipos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False)
    company: Mapped[Company] = relationship()
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    issue_price_lower: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    issue_price_upper: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    issue_size: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    opening_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    closing_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="upcoming")
    score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Thesis(Base):
    __tablename__ = "theses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    thesis_text: Mapped[str] = mapped_column(Text, nullable=False)
    health_score: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ThesisAssumption(Base):
    __tablename__ = "thesis_assumptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    thesis_id: Mapped[int] = mapped_column(ForeignKey("theses.id"), nullable=False)
    metric: Mapped[str] = mapped_column(String(120), nullable=False)
    operator: Mapped[str] = mapped_column(String(15), nullable=False)
    target_value: Mapped[float] = mapped_column(Float, nullable=False)
    actual_value: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="NOT_ENOUGH_DATA")
    source: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    last_checked_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


class Trade(Base):
    __tablename__ = "trades"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    symbol: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    side: Mapped[str] = mapped_column(String(20), nullable=False)
    quantity: Mapped[float] = mapped_column(Float, default=0)
    price: Mapped[float] = mapped_column(Float, default=0)
    fees: Mapped[float] = mapped_column(Float, default=0)
    trade_value: Mapped[float] = mapped_column(Float, default=0)
    date: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    symbol: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    quantity: Mapped[float] = mapped_column(Float, default=0)
    avg_price: Mapped[float] = mapped_column(Float, default=0)
    sector: Mapped[str] = mapped_column(String(120), default="Unknown")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class DocumentRecord(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    company_id: Mapped[Optional[int]] = mapped_column(ForeignKey("companies.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    document_type: Mapped[str] = mapped_column(String(80), nullable=False)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class NewsItem(Base):
    __tablename__ = "news"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    company_id: Mapped[Optional[int]] = mapped_column(ForeignKey("companies.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(String(120), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    published_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    sentiment: Mapped[str] = mapped_column(String(30), default="neutral")
    importance: Mapped[str] = mapped_column(String(30), default="medium")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    plan: Mapped[str] = mapped_column(String(40), default="FREE")
    status: Mapped[str] = mapped_column(String(40), default="ACTIVE")
    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ends_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    order_id: Mapped[str] = mapped_column(String(255), nullable=False)
    payment_id: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    plan: Mapped[str] = mapped_column(String(40), default="FREE")
    amount: Mapped[float] = mapped_column(Float, default=0)
    status: Mapped[str] = mapped_column(String(40), default="PENDING")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    action: Mapped[str] = mapped_column(String(255), nullable=False)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
