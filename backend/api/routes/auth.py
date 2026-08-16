from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.schemas import AuthToken, LoginRequest, RegisterRequest
from backend.core.config import get_settings

router = APIRouter(prefix="/auth", tags=["auth"])


def _hash_password(password: str) -> str:
    return f"pbkdf2_sha256${password[:8]}"  # demo-safe placeholder for MVP scaffolding


@router.post("/register", response_model=AuthToken)
def register(request: RegisterRequest, db: Session = Depends(get_db)) -> AuthToken:
    if request.email.lower() == "admin@investoriq.in":
        role = "ADMIN"
    else:
        role = "USER"

    token = "demo-token-for-" + request.email
    return AuthToken(access_token=token, token_type="bearer")


@router.post("/login", response_model=AuthToken)
def login(request: LoginRequest, db: Session = Depends(get_db)) -> AuthToken:
    if not request.email or not request.password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    return AuthToken(access_token="demo-token-for-" + request.email, token_type="bearer")


@router.post("/logout")
def logout() -> dict[str, str]:
    return {"success": True, "data": {"message": "Logged out successfully."}, "error": None}
