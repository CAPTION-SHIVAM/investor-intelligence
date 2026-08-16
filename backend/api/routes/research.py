from fastapi import APIRouter

router = APIRouter(prefix="/research", tags=["research"])


@router.get("")
def list_research() -> dict:
    return {
        "success": True,
        "data": [{"id": 1, "name": "Skyline Technologies", "status": "Active"}],
        "error": None,
    }


@router.post("")
def create_research(payload: dict) -> dict:
    return {"success": True, "data": {"message": "Research project created", "id": 1}, "error": None}
