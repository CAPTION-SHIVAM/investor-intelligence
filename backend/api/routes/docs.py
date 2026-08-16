from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/documents", tags=["documents"])


@router.get("")
def list_documents() -> dict:
    return {
        "success": True,
        "data": [{"id": 1, "title": "Skyline Annual Report 2025", "type": "annual_report"}],
        "error": None,
    }


@router.post("/upload")
def upload_document() -> dict:
    return {"success": True, "data": {"message": "Document uploaded successfully."}, "error": None}
