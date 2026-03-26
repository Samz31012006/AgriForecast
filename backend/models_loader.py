from __future__ import annotations

import logging
import pickle
from typing import Any

from backend.config import settings

logger = logging.getLogger(__name__)


def _load_model(filename: str) -> Any | None:
    model_file = settings.model_path / filename

    if not model_file.exists():
        logger.warning("Model file not found: %s", model_file)
        return None

    try:
        with model_file.open("rb") as file_handle:
            return pickle.load(file_handle)
    except Exception as exc:
        logger.warning("Failed to load model file %s: %s", model_file, exc)
        return None


def load_yield_model() -> Any | None:
    return _load_model("yield_model.pkl")


def load_price_model() -> Any | None:
    return _load_model("price_model.pkl")


class ModelRegistry:
    def __init__(self) -> None:
        self.yield_model = load_yield_model()
        self.price_model = load_price_model()

    @property
    def models_loaded(self) -> bool:
        return self.yield_model is not None and self.price_model is not None


model_registry = ModelRegistry()
