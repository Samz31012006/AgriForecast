# Data Contracts

## Predict Request
Endpoint:
- `POST /predict`

Request body:
```json
{
  "region": "North Karnataka",
  "soil_type": "Loamy",
  "crop": "Maize",
  "rainfall_mm": 820.5,
  "temperature_celsius": 28.4,
  "fertilizer_used": true,
  "irrigation_used": true,
  "weather_condition": "Cloudy",
  "days_to_harvest": 45
}
```

Rules:
- all fields required for MVP
- backend converts the request into one ordered feature row for inference
- if model inference fails for any reason, backend must fall back to safe mock outputs

## Model Input
Internal feature row shape:
```json
[
  [
    "North Karnataka",
    "Loamy",
    "Maize",
    820.5,
    28.4,
    true,
    true,
    "Cloudy",
    45
  ]
]
```

Rules:
- field order must match the request schema exactly in this phase
- model incompatibility should trigger fallback instead of crashing the endpoint

## Model Output
Yield prediction output:
```json
3.5
```

Price prediction output:
```json
1450.0
```

## Gemma Input
Deferred in this phase. Advisory is a placeholder string and Gemma is not yet called from `/predict`.

## Final Response
```json
{
  "yield_prediction": 3.5,
  "price_prediction": 1450.0,
  "price_trend": "stable",
  "advisory": "Recommended to sell within 1-2 weeks"
}
```

## Contract Rule
- Predictions must remain numeric in this phase.
- Any future schema or response change must update this file immediately.
