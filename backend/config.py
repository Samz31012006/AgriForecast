from __future__ import annotations

from pathlib import Path

from pydantic import BaseModel, Field


def _load_dotenv(env_path: Path) -> dict[str, str]:
    values: dict[str, str] = {}

    if not env_path.exists():
        return values

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")

    return values


BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
ENV_VALUES = _load_dotenv(ENV_PATH)


import os

class Settings(BaseModel):
    google_api_key: str | None = Field(
        default=os.getenv("GOOGLE_API_KEY") or ENV_VALUES.get("GOOGLE_API_KEY")
    )
    model_path: Path = Field(
        default=Path(os.getenv("MODEL_PATH") or ENV_VALUES.get("MODEL_PATH", str(BASE_DIR / "models")))
    )
    # Security Settings
    firebase_project_id: str | None = Field(
        default=os.getenv("NEXT_PUBLIC_FIREBASE_PROJECT_ID") or ENV_VALUES.get("NEXT_PUBLIC_FIREBASE_PROJECT_ID")
    )
    cors_origins: list[str] = Field(
        default=(os.getenv("CORS_ORIGINS") or ENV_VALUES.get("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001")).split(",")
    )
    rate_limit_default: str = Field(
        default=os.getenv("RATE_LIMIT_DEFAULT") or ENV_VALUES.get("RATE_LIMIT_DEFAULT", "10/minute")
    )


settings = Settings()
