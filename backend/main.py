import logging
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from backend.advisory_service import generate_advisory
from backend.model_service import predict_yield, predict_price
from backend.schemas import PredictRequest, PredictResponse
from backend.config import settings
from backend.security import verify_firebase_token

logger = logging.getLogger(__name__)

# Initialize Rate Limiter
limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="AgriForecast Backend", version="0.3.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Allow explicit origins for Vercel and Localhost to ensure credentials work
allowed_origins = [
    "https://agriforecastml.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001"
]

# Add any additional origins from environment variables
if settings.cors_origins:
    for origin in settings.cors_origins:
        if origin and origin not in allowed_origins:
            allowed_origins.append(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "AgriForecast API is running"}


@app.get("/health")
def health() -> dict:
    from backend.model_service import model_store
    
    return {
        "status": "ok",
        "yield_model": model_store.yield_model is not None,
        "price_xgb": model_store.price_xgb is not None,
        "price_prophet": model_store.price_prophet is not None
    }


@app.post("/predict", response_model=PredictResponse)
@limiter.limit(settings.rate_limit_default)
def predict(
    request: Request,
    payload: PredictRequest, 
    token: dict = Depends(verify_firebase_token)
) -> PredictResponse:
    # Yield prediction
    yield_pred = predict_yield(payload.dict())

    # Price prediction
    price_pred_info = predict_price(payload.dict())

    # Advisory
    advisory = generate_advisory(
        yield_pred,
        price_pred_info["price_prediction"],
        price_pred_info["price_trend"],
        payload.crop,
    )

    return PredictResponse(
        yield_prediction=yield_pred,
        price_prediction=price_pred_info["price_prediction"],
        price_trend=price_pred_info["price_trend"],
        confidence=price_pred_info["confidence"],
        advisory=advisory,
    )
