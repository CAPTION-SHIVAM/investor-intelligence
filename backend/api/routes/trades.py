from fastapi import APIRouter, HTTPException

from backend.services.trade_analysis_service import TradeAnalysisService

router = APIRouter(prefix="/trades", tags=["trades"])
service = TradeAnalysisService()


@router.post("/import")
def import_trades(payload: list[dict]) -> dict:
    if not payload:
        raise HTTPException(status_code=400, detail="No trades supplied")
    return {"success": True, "data": {"imported": len(payload), "message": "Trades imported successfully."}, "error": None}


@router.get("/analysis")
def analysis() -> dict:
    sample = [
        {"symbol": "TCS", "pnl": 1200},
        {"symbol": "INFY", "pnl": -400},
        {"symbol": "TCS", "pnl": 1800},
        {"symbol": "RELIANCE", "pnl": -700},
    ]
    return {"success": True, "data": service.analyze(sample), "error": None}
