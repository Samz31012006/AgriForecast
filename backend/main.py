import logging

from fastapi import FastAPI

from backend.advisory_service import generate_advisory
from backend.config import settings
from backend.mandi_service import get_mandi_price
from backend.models_loader import model_registry
from backend.schemas import PredictRequest, PredictResponse

logger = logging.getLogger(__name__)

YIELD_FALLBACK = 3.5
PRICE_FALLBACK = 1450.0

app = FastAPI(title="AgriForecast Backend", version="0.1.0")


@app.get("/health")
def health() -> dict:
    warnings: list[str] = []

    if model_registry.yield_model is None or model_registry.price_model is None:
        warnings.append("STOP HERE: Place trained models in /models")

    return {
        "status": "ok",
        "models_loaded": model_registry.models_loaded,
        "google_api_configured": bool(settings.google_api_key),
        "model_path": str(settings.model_path),
        "warnings": warnings,
    }


def _build_feature_row(request: PredictRequest) -> list[list[object]]:
    return [[
        request.region,
        request.soil_type,
        request.crop,
        request.rainfall_mm,
        request.temperature_celsius,
        request.fertilizer_used,
        request.irrigation_used,
        request.weather_condition,
        request.days_to_harvest,
    ]]


def _safe_predict(model: object | None, features: list[list[object]], fallback: float, model_name: str) -> float:
    if model is None:
        return fallback

    try:
        raw_prediction = model.predict(features)

        if isinstance(raw_prediction, (list, tuple)):
            return float(raw_prediction[0])

        if hasattr(raw_prediction, "__getitem__"):
            return float(raw_prediction[0])

        return float(raw_prediction)
    except Exception as exc:
        logger.warning("%s prediction failed, using fallback %s: %s", model_name, fallback, exc)
        return fallback


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    feature_row = _build_feature_row(request)
    mandi_data = get_mandi_price(request.crop)

    yield_prediction = _safe_predict(
        model=model_registry.yield_model,
        features=feature_row,
        fallback=YIELD_FALLBACK,
        model_name="Yield model",
    )
    price_prediction = _safe_predict(
        model=model_registry.price_model,
        features=feature_row,
        fallback=PRICE_FALLBACK,
        model_name="Price model",
    )

    advisory = generate_advisory(
        yield_prediction,
        price_prediction,
        mandi_data["trend"],
        request.crop
    )

    return PredictResponse(
        yield_prediction=yield_prediction,
        price_prediction=price_prediction,
        price_trend=mandi_data["trend"],
        advisory=advisory,
    )
