from pydantic import BaseModel


class PredictRequest(BaseModel):
    region: str
    soil_type: str
    crop: str
    rainfall_mm: float
    temperature_celsius: float
    fertilizer_used: bool
    irrigation_used: bool
    weather_condition: str
    days_to_harvest: int


class PredictResponse(BaseModel):
    yield_prediction: float
    price_prediction: float
    price_trend: str
    advisory: str
