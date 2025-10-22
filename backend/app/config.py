from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    api_host: str = Field(default="127.0.0.1")
    api_port: int = Field(default=8000)
    cors_origin: str = Field(default="http://localhost:5173")
    jwt_secret: str = Field(default="change-me-in-production")
    jwt_alg: str = Field(default="HS256")
    admin_email: str = Field(default="admin@example.com")
    admin_password: str = Field(default="admin123")
    database_url: str = Field(default="sqlite:///./app.db")

    model_config = {
        "env_prefix": "",
        "env_file": ".env",
        "extra": "ignore",
    }


@lru_cache()
def get_settings() -> Settings:
    return Settings()  # type: ignore[arg-type]
