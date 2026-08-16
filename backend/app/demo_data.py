from __future__ import annotations

DEMO_COMPANIES = [
    {
        "id": 1,
        "name": "Skyline Technologies",
        "symbol": "SKYLINE",
        "exchange": "NSE",
        "sector": "Technology",
        "industry": "Software",
        "market_cap": 154000000000,
        "description": "Demo company for product and UX validation.",
    },
    {
        "id": 2,
        "name": "Nova Finance",
        "symbol": "NOVA",
        "exchange": "NSE",
        "sector": "Financial Services",
        "industry": "NBFC",
        "market_cap": 89000000000,
        "description": "Demo company for product and UX validation.",
    },
    {
        "id": 3,
        "name": "GreenVolt Energy",
        "symbol": "GVOLT",
        "exchange": "NSE",
        "sector": "Energy",
        "industry": "Renewables",
        "market_cap": 113000000000,
        "description": "Demo company for product and UX validation.",
    },
    {
        "id": 4,
        "name": "Vertex Systems",
        "symbol": "VTX",
        "exchange": "NSE",
        "sector": "Technology",
        "industry": "Enterprise Tech",
        "market_cap": 122000000000,
        "description": "Demo company for product and UX validation.",
    },
]

DEMO_IPOS = [
    {
        "id": 1,
        "company": "Skyline Technologies",
        "symbol": "SKYLINE",
        "price_band": "₹380-₹400",
        "issue_size": 1800,
        "opening_date": "2026-09-02",
        "closing_date": "2026-09-06",
        "reality_score": 82,
        "risk": "Low",
        "status": "Good Research Profile",
    },
    {
        "id": 2,
        "company": "Nova Finance",
        "symbol": "NOVA",
        "price_band": "₹260-₹280",
        "issue_size": 1200,
        "opening_date": "2026-09-08",
        "closing_date": "2026-09-12",
        "reality_score": 73,
        "risk": "Moderate",
        "status": "Watchlist",
    },
    {
        "id": 3,
        "company": "GreenVolt Energy",
        "symbol": "GVOLT",
        "price_band": "₹420-₹450",
        "issue_size": 2100,
        "opening_date": "2026-09-15",
        "closing_date": "2026-09-19",
        "reality_score": 68,
        "risk": "Moderate",
        "status": "Needs Deeper Review",
    },
]

DEMO_DASHBOARD = {
    "greeting": "Good afternoon, Aditi",
    "kpis": [
        {"label": "Portfolio Value", "value": "₹12,45,678", "change": "+4.7%"},
        {"label": "Overall Return", "value": "+18.45%", "change": "+1.9%"},
        {"label": "Average Thesis Health", "value": "72/100", "change": "-3"},
        {"label": "Investor Score", "value": "68/100", "change": "+2"},
    ],
    "ipo_radar": [
        {"company": "Skyline Technologies", "price_band": "₹380–₹400", "reality_score": 82, "issue_date": "2026-09-02", "risk": "Low", "status": "Good Research Profile"},
        {"company": "Nova Finance", "price_band": "₹260–₹280", "reality_score": 73, "issue_date": "2026-09-08", "risk": "Moderate", "status": "Watchlist"},
        {"company": "GreenVolt Energy", "price_band": "₹420–₹450", "reality_score": 68, "issue_date": "2026-09-15", "risk": "Moderate", "status": "Needs Review"},
    ],
    "thesis_health": [
        {"company": "Tata Motors", "previous_score": 82, "current_score": 74, "change": -8, "status": "Warning"},
        {"company": "HDFC Bank", "previous_score": 78, "current_score": 72, "change": -6, "status": "Watch"},
    ],
    "mistakes": {
        "investor_score": 68,
        "top_issues": [
            "High trading frequency",
            "Long losing periods",
            "Early profit booking",
            "Sector concentration",
        ],
    },
    "market_overview": {
        "NIFTY_50": "24,853.40",
        "SENSEX": "81,347.92",
        "NIFTY_BANK": "52,260.80",
        "note": "Demo data — connect a licensed data provider for live market data.",
    },
    "briefing": "Your portfolio has 3 important events this week.",
}

DEMO_TRADES = [{
    "date": "2026-07-01",
    "symbol": "TCS",
    "side": "BUY",
    "quantity": 20,
    "price": 4100,
    "fees": 25,
    "trade_value": 82000,
    "pnl": 1200,
}, {
    "date": "2026-07-08",
    "symbol": "INFY",
    "side": "BUY",
    "quantity": 30,
    "price": 1650,
    "fees": 30,
    "trade_value": 49500,
    "pnl": -400,
}, {
    "date": "2026-07-16",
    "symbol": "TCS",
    "side": "SELL",
    "quantity": 12,
    "price": 4320,
    "fees": 25,
    "trade_value": 51840,
    "pnl": 1800,
}, {
    "date": "2026-07-22",
    "symbol": "RELIANCE",
    "side": "BUY",
    "quantity": 25,
    "price": 2840,
    "fees": 35,
    "trade_value": 71000,
    "pnl": -700,
}]

DEMO_PORTFOLIO = {
    "total_value": 1245678,
    "invested_value": 1045000,
    "unrealized_pl": 160000,
    "realized_pl": 45000,
    "sector_allocation": [
        {"name": "Technology", "value": 31},
        {"name": "Banking", "value": 24},
        {"name": "Energy", "value": 18},
        {"name": "Other", "value": 27},
    ],
    "holdings": [
        {"symbol": "TCS", "name": "Tata Consultancy Services", "weight": 31},
        {"symbol": "HDFCBANK", "name": "HDFC Bank", "weight": 24},
        {"symbol": "RELIANCE", "name": "Reliance Industries", "weight": 18},
    ],
}
