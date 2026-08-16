from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = Field(default="InvestorIQ")
    environment: Literal["development", "test", "production"] = "development"
    demo_mode: bool = True
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/investoriq"
    redis_url: str = "redis://localhost:6379/0"
    llm_provider: str = "mock"
    llm_api_key: str = ""
    market_data_provider: str = "mock"
    market_data_api_key: str = ""
    jwt_secret: str = "change-me-in-production"
    cookie_secret: str = "change-me-in-production"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
