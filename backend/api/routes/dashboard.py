from fastapi import APIRouter

from backend.providers.market_data_provider import MockMarketDataProvider
from backend.services.market_service import FreeMarketService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])
service = FreeMarketService()
provider = MockMarketDataProvider()


@router.get("")
def get_dashboard() -> dict:
    market = service.get_market_snapshot()
    ipos = provider.get_ipo_data()

    ipo_radar_summary = [
        {
            "id": item["id"],
            "company": item["company"],
            "price_band": item["price_band"],
            "reality_score": item["reality_score"],
            "issue_date": f"{item['open_date']} to {item['close_date']}",
            "gmp": item.get("gmp", "—"),
            "risk": "Low" if item["reality_score"] >= 85 else ("Moderate" if item["reality_score"] >= 70 else "High"),
            "status": item["status"],
            "verdict": item["verdict"],
        }
        for item in ipos[:4]
    ]

    return {
        "success": True,
        "data": {
            "greeting": "Welcome to Investor Intelligence",
            "kpis": [
                {"label": "Portfolio Value", "value": "₹24,85,420", "change": "+18.4% YTD"},
                {"label": "IPO Reality Index", "value": "84.2/100", "change": "+3.6 pts"},
                {"label": "Win Rate (IPO)", "value": "87.5%", "change": "7/8 closed positive"},
                {"label": "Risk Health Score", "value": "91/100", "change": "Safe Diversification"},
            ],
            "ipo_radar": ipo_radar_summary,
            "thesis_health": [
                {"company": "Swiggy Limited", "previous_score": 72, "current_score": 76, "change": "+4", "status": "Instamart Margin Expansion"},
                {"company": "Hyundai Motor India", "previous_score": 82, "current_score": 84, "change": "+2", "status": "SUV Market Leadership"},
                {"company": "Bajaj Housing Finance", "previous_score": 88, "current_score": 91, "change": "+3", "status": "0.27% Pristine NPA"},
                {"company": "Ather Energy", "previous_score": 75, "current_score": 79, "change": "+4", "status": "Rizta Volume Ramp"},
            ],
            "mistakes": {
                "investor_score": 86,
                "top_issues": [
                    "Slight sector overweight in Tech & Consumer Internet (24%)",
                    "Maintain cash reserve for high-conviction upcoming Mainboard IPO allotments",
                    "Take partial listing gains on issues opening with GMP above 50%",
                ],
            },
            "market_overview": market.get("data", {}).get("market_overview", {}),
            "detailed_indices": market.get("data", {}).get("detailed_indices", {}),
            "briefing": market.get("data", {}).get("briefing", "Indian benchmark indices trading steady with robust domestic institutional investor (DII) buying support."),
        },
        "error": None,
    }
