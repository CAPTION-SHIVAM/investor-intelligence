from fastapi import APIRouter, HTTPException

from backend.providers.market_data_provider import MockMarketDataProvider

router = APIRouter(prefix="/companies", tags=["companies"])
provider = MockMarketDataProvider()


@router.get("")
def list_companies() -> dict:
    return {
        "success": True,
        "data": [
            {"id": 1, "name": "Skyline Technologies", "symbol": "SKYLINE", "exchange": "NSE", "sector": "Technology"},
            {"id": 2, "name": "Nova Finance", "symbol": "NOVA", "exchange": "NSE", "sector": "Financial Services"},
            {"id": 3, "name": "GreenVolt Energy", "symbol": "GVOLT", "exchange": "NSE", "sector": "Energy"},
        ],
        "error": None,
    }


@router.get("/{symbol}")
def get_company(symbol: str) -> dict:
    profile = provider.get_company_profile(symbol)
    if not profile:
        raise HTTPException(status_code=404, detail="Company not found")
    return {"success": True, "data": profile, "error": None}
