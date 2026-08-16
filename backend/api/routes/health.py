from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health_check() -> dict[str, str]:
    return {"status": "ok", "message": "InvestorIQ backend health check passed."}


@router.get("/db")
def db_health_check() -> dict[str, str]:
    return {"status": "demo", "message": "Database health endpoint is ready. Connect PostgreSQL for production mode."}


@router.get("/redis")
def redis_health_check() -> dict[str, str]:
    return {"status": "demo", "message": "Redis health endpoint is ready. Connect Redis for production mode."}
