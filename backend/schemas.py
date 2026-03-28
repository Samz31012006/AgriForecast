from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    region: str = Field(..., min_length=1, max_length=100)
    soil_type: str = Field(..., min_length=1, max_length=100)
    crop: str = Field(..., min_length=1, max_length=100)
    rainfall_mm: float = Field(..., ge=0, le=5000)
    temperature_celsius: float = Field(..., ge=-50, le=60)
    fertilizer_used: bool
    irrigation_used: bool
    weather_condition: str = Field(..., min_length=1, max_length=100)
    days_to_harvest: int = Field(..., ge=1, le=365)


class PredictResponse(BaseModel):
    yield_prediction: float
    price_prediction: float
    price_trend: str
    confidence: float = 0.0
    advisory: str
