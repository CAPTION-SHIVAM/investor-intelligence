from __future__ import annotations

from typing import Optional
from fastapi import APIRouter, Query

router = APIRouter(prefix="/screener", tags=["screener"])

STOCKS_DATABASE = [
    {
        "symbol": "RELIANCE",
        "company": "Reliance Industries Ltd",
        "sector": "Energy & Conglomerate",
        "market_cap_category": "Large Cap",
        "market_cap_cr": 2015400,
        "price": 2980.50,
        "change_pct": 1.45,
        "pe": 27.4,
        "pb": 2.4,
        "roe": 14.8,
        "roce": 13.5,
        "debt_equity": 0.42,
        "dividend_yield": 0.35,
        "score": 88,
        "is_pro": False,
    },
    {
        "symbol": "TCS",
        "company": "Tata Consultancy Services",
        "sector": "IT & Software",
        "market_cap_category": "Large Cap",
        "market_cap_cr": 1524000,
        "price": 4210.00,
        "change_pct": 2.10,
        "pe": 31.2,
        "pb": 14.5,
        "roe": 48.5,
        "roce": 61.2,
        "debt_equity": 0.0,
        "dividend_yield": 1.25,
        "score": 92,
        "is_pro": False,
    },
    {
        "symbol": "HDFCBANK",
        "company": "HDFC Bank Ltd",
        "sector": "Banking & Finance",
        "market_cap_category": "Large Cap",
        "market_cap_cr": 1285600,
        "price": 1690.25,
        "change_pct": -0.45,
        "pe": 19.5,
        "pb": 2.8,
        "roe": 16.9,
        "roce": 15.2,
        "debt_equity": 0.85,
        "dividend_yield": 1.10,
        "score": 89,
        "is_pro": False,
    },
    {
        "symbol": "INFY",
        "company": "Infosys Ltd",
        "sector": "IT & Software",
        "market_cap_category": "Large Cap",
        "market_cap_cr": 758000,
        "price": 1825.80,
        "change_pct": 1.15,
        "pe": 26.5,
        "pb": 8.6,
        "roe": 31.8,
        "roce": 40.5,
        "debt_equity": 0.0,
        "dividend_yield": 2.10,
        "score": 87,
        "is_pro": False,
    },
    {
        "symbol": "TATAMOTORS",
        "company": "Tata Motors Ltd",
        "sector": "Automotive",
        "market_cap_category": "Large Cap",
        "market_cap_cr": 385000,
        "price": 1045.60,
        "change_pct": 3.20,
        "pe": 17.8,
        "pb": 4.1,
        "roe": 34.5,
        "roce": 22.8,
        "debt_equity": 0.65,
        "dividend_yield": 0.60,
        "score": 86,
        "is_pro": False,
    },
    {
        "symbol": "BAJFINANCE",
        "company": "Bajaj Finance Ltd",
        "sector": "Banking & Finance",
        "market_cap_category": "Large Cap",
        "market_cap_cr": 445000,
        "price": 7180.00,
        "change_pct": 0.80,
        "pe": 32.4,
        "pb": 6.8,
        "roe": 22.4,
        "roce": 24.1,
        "debt_equity": 3.4,
        "dividend_yield": 0.50,
        "score": 85,
        "is_pro": False,
    },
    {
        "symbol": "ZOMATO",
        "company": "Zomato Ltd",
        "sector": "Consumer Tech",
        "market_cap_category": "Large Cap",
        "market_cap_cr": 234000,
        "price": 265.40,
        "change_pct": 4.60,
        "pe": 110.5,
        "pb": 9.8,
        "roe": 8.5,
        "roce": 10.2,
        "debt_equity": 0.0,
        "dividend_yield": 0.0,
        "score": 79,
        "is_pro": True,
    },
    {
        "symbol": "KAYNES",
        "company": "Kaynes Technology India",
        "sector": "Electronics & EMS",
        "market_cap_category": "Mid Cap",
        "market_cap_cr": 36500,
        "price": 5420.00,
        "change_pct": 5.40,
        "pe": 84.0,
        "pb": 12.2,
        "roe": 19.8,
        "roce": 22.4,
        "debt_equity": 0.15,
        "dividend_yield": 0.10,
        "score": 91,
        "is_pro": True,
    },
    {
        "symbol": "TATACOMM",
        "company": "Tata Communications Ltd",
        "sector": "Telecom & Cloud",
        "market_cap_category": "Mid Cap",
        "market_cap_cr": 58200,
        "price": 2040.00,
        "change_pct": 1.95,
        "pe": 36.5,
        "pb": 15.4,
        "roe": 38.0,
        "roce": 26.5,
        "debt_equity": 1.10,
        "dividend_yield": 0.85,
        "score": 84,
        "is_pro": True,
    },
    {
        "symbol": "SOLARINDS",
        "company": "Solar Industries India",
        "sector": "Defence & Industrial",
        "market_cap_category": "Mid Cap",
        "market_cap_cr": 98400,
        "price": 10870.00,
        "change_pct": 2.80,
        "pe": 72.0,
        "pb": 24.0,
        "roe": 32.5,
        "roce": 35.0,
        "debt_equity": 0.30,
        "dividend_yield": 0.15,
        "score": 93,
        "is_pro": True,
    },
    {
        "symbol": "DATAPATTNS",
        "company": "Data Patterns (India) Ltd",
        "sector": "Defence & Industrial",
        "market_cap_category": "Small Cap",
        "market_cap_cr": 17800,
        "price": 3180.00,
        "change_pct": 3.85,
        "pe": 68.0,
        "pb": 14.2,
        "roe": 22.4,
        "roce": 27.8,
        "debt_equity": 0.02,
        "dividend_yield": 0.20,
        "score": 90,
        "is_pro": True,
    },
    {
        "symbol": "EMS",
        "company": "EMS Limited",
        "sector": "Water & Infrastructure",
        "market_cap_category": "Small Cap",
        "market_cap_cr": 4200,
        "price": 755.00,
        "change_pct": 1.25,
        "pe": 19.4,
        "pb": 4.2,
        "roe": 24.8,
        "roce": 31.0,
        "debt_equity": 0.08,
        "dividend_yield": 0.80,
        "score": 83,
        "is_pro": True,
    },
]


@router.get("")
def screen_stocks(
    sector: Optional[str] = Query(None, description="Filter by sector"),
    cap_category: Optional[str] = Query(None, description="Large Cap, Mid Cap, Small Cap"),
    max_pe: Optional[float] = Query(None, description="Maximum P/E ratio"),
    min_roe: Optional[float] = Query(None, description="Minimum ROE %"),
    max_debt_equity: Optional[float] = Query(None, description="Maximum Debt-to-Equity"),
    min_score: Optional[int] = Query(None, description="Minimum Reality Score"),
    search: Optional[str] = Query(None, description="Search symbol or name"),
    sort_by: str = Query("score", description="Sort field: score, market_cap_cr, roe, pe, change_pct"),
    order: str = Query("desc", description="asc or desc"),
) -> dict:
    results = list(STOCKS_DATABASE)

    if sector and sector != "All Sectors":
        results = [s for s in results if s["sector"].lower() == sector.lower()]

    if cap_category and cap_category != "All Market Caps":
        results = [s for s in results if s["market_cap_category"].lower() == cap_category.lower()]

    if max_pe is not None:
        results = [s for s in results if s["pe"] <= max_pe]

    if min_roe is not None:
        results = [s for s in results if s["roe"] >= min_roe]

    if max_debt_equity is not None:
        results = [s for s in results if s["debt_equity"] <= max_debt_equity]

    if min_score is not None:
        results = [s for s in results if s["score"] >= min_score]

    if search:
        q = search.lower()
        results = [
            s for s in results
            if q in s["symbol"].lower() or q in s["company"].lower() or q in s["sector"].lower()
        ]

    reverse = order.lower() == "desc"
    results.sort(key=lambda x: x.get(sort_by, 0), reverse=reverse)

    sectors = sorted(list({s["sector"] for s in STOCKS_DATABASE}))

    return {
        "success": True,
        "total": len(results),
        "sectors": ["All Sectors"] + sectors,
        "data": results,
        "error": None,
    }
