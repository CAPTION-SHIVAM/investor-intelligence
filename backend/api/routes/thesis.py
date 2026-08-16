from fastapi import APIRouter, HTTPException

from backend.services.thesis_service import ThesisHealthService

router = APIRouter(prefix="/thesis", tags=["thesis"])
service = ThesisHealthService()


@router.get("")
def get_thesis() -> dict:
    assumptions = [
        {"metric": "Revenue growth", "status": "ON_TRACK"},
        {"metric": "EBITDA margin", "status": "WARNING"},
        {"metric": "Debt/equity", "status": "FAILED"},
        {"metric": "New product revenue", "status": "NOT_ENOUGH_DATA"},
    ]
    score, counts = service.calculate_health_score(assumptions)
    return {"success": True, "data": {"score": score, "counts": counts}, "error": None}


@router.post("")
def create_thesis(payload: dict) -> dict:
    if not payload.get("title"):
        raise HTTPException(status_code=400, detail="Thesis title is required")
    return {"success": True, "data": {"message": "Thesis created successfully", "id": 1}, "error": None}
