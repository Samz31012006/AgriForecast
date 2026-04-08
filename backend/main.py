import logging
from fastapi import FastAPI, Depends
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

# Allow all origins if '*' is present, but handle the credentials restriction
cors_origins = settings.cors_origins
allow_all = "*" in cors_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=[] if allow_all else cors_origins,
    allow_origin_regex=".*" if allow_all else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
    request: PredictRequest, 
    token: dict = Depends(verify_firebase_token)
) -> PredictResponse:
    # Yield prediction
    yield_pred = predict_yield(request.dict())

    # Price prediction
    price_pred_info = predict_price(request.dict())

    # Advisory
    advisory = generate_advisory(
        yield_pred,
        price_pred_info["price_prediction"],
        price_pred_info["price_trend"],
        request.crop,
    )

    return PredictResponse(
        yield_prediction=yield_pred,
        price_prediction=price_pred_info["price_prediction"],
        price_trend=price_pred_info["price_trend"],
        confidence=price_pred_info["confidence"],
        advisory=advisory,
    )
