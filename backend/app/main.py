import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.routes.ai import router as ai_router
from backend.api.routes.auth import router as auth_router
from backend.api.routes.billing import router as billing_router
from backend.api.routes.companies import router as companies_router
from backend.api.routes.dashboard import router as dashboard_router
from backend.api.routes.docs import router as docs_router
from backend.api.routes.health import router as health_router
from backend.api.routes.ipos import router as ipos_router
from backend.api.routes.research import router as research_router
from backend.api.routes.screener import router as screener_router
from backend.api.routes.thesis import router as thesis_router
from backend.api.routes.trades import router as trades_router

app = FastAPI(
    title="Investor Intelligence API",
    version="1.0.0",
    description="Investor Intelligence production-ready backend engine for IPO scoring, real stock screening, live market feeds, and premium billing.",
)

# Configure CORS
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
if "*" in allowed_origins or os.getenv("ALLOW_ALL_ORIGINS", "true").lower() == "true":
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True if allowed_origins != ["*"] else False,
)

app.include_router(health_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(billing_router, prefix="/api")
app.include_router(companies_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(ipos_router, prefix="/api")
app.include_router(screener_router, prefix="/api")
app.include_router(research_router, prefix="/api")
app.include_router(thesis_router, prefix="/api")
app.include_router(docs_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(trades_router, prefix="/api")


@app.get("/")
def read_root() -> dict[str, str]:
    return {
        "service": "Investor Intelligence Core API",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs",
    }
