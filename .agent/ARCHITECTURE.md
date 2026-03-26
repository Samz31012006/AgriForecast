# Architecture

## End-to-End Request Flow
1. Frontend submits `POST /predict` with agronomic request fields.
2. FastAPI validates the request against the current `PredictRequest` contract.
3. Backend builds a deterministic single-row feature payload in the same field order as the request schema.
4. Yield model loader is checked; if the model exists, backend attempts inference, otherwise it falls back to `3.5`.
5. Price model loader is checked; if the model exists, backend attempts inference, otherwise it falls back to `1450.0`.
6. Backend calls the mock mandi service to get current price context and `price_trend`.
7. Backend generates placeholder advisory text without invoking Gemma yet.
8. Response composer returns a numeric `PredictResponse`.

## Text Diagram
```text
Mobile UI
  -> Next.js server/client boundary
  -> FastAPI prediction endpoint
      -> request validation
      -> feature row builder
      -> yield model service (XGBoost or fallback)
      -> price model service (Prophet or fallback)
      -> mandi mock service
      -> advisory placeholder service
      -> response composer
  -> mobile prediction view
```

## Component Responsibilities
- Next.js frontend: collect user input, render prediction cards, charts, and advisory in a mobile-first layout.
- FastAPI router: validate requests, enforce contracts, and orchestrate downstream services.
- Feature builder: transform request fields into the ordered single-row payload sent to model `predict()`.
- Yield model service: load and execute XGBoost artifact when present, otherwise use a fallback value.
- Price model service: load and execute Prophet artifact when present, otherwise use a fallback value.
- Market data service: provide mock mandi price context and current trend for early integration.
- Advisory service: return placeholder advisory text until Gemma integration is added.
- SQLite store: hold reference metadata, cache entries, ingestion state, and request audit metadata for MVP use.

## Backend Skeleton Structure
Current backend implementation is organized as:
- `backend/main.py`
  - FastAPI app setup
  - `/health` endpoint
  - `/predict` real endpoint with optional model inference and fallback values
- `backend/config.py`
  - loads `GOOGLE_API_KEY` and `MODEL_PATH` from `.env`
- `backend/models_loader.py`
  - exposes `load_yield_model()` and `load_price_model()`
  - attempts to load `yield_model.pkl` and `price_model.pkl`
  - logs warnings and continues if files are missing
- `backend/mandi_service.py`
  - mock mandi-price service returning current price and price trend
- `backend/advisory_service.py`
  - placeholder advisory generator
- `backend/schemas.py`
  - request and response contracts for the prediction API

The backend skeleton is intentionally non-blocking:
- missing model files do not crash app startup
- `/health` exposes model readiness warnings
- `/predict` returns fallback numeric values when models are missing or prediction fails

## Predict Flow Details
- Request fields: `region`, `soil_type`, `crop`, `rainfall_mm`, `temperature_celsius`, `fertilizer_used`, `irrigation_used`, `weather_condition`, `days_to_harvest`
- Yield fallback: `3.5`
- Price fallback: `1450.0`
- Price trend source: mandi service mock
- Advisory source: fixed placeholder response

## Model Optional Behavior
- If `/models/yield_model.pkl` is missing, yield prediction falls back to `3.5`.
- If `/models/price_model.pkl` is missing, price prediction falls back to `1450.0`.
- If a loaded model throws during `predict()`, backend logs a warning and falls back instead of failing the request.

## Separation of Concerns
- ML layer owns numeric prediction outputs.
- LLM layer never computes yield or price values.
- LLM input is limited to structured ML outputs, feature summaries, market context, and instruction constraints.
- Final response must preserve ML outputs separately from advisory text so the UI can display them independently.

## Caching Strategy
- Cache mandi data by `state + district + crop + mandi + date` with a short TTL suitable for daily market refreshes.
- Cache weather fallback responses by geography and date window.
- Cache normalized reference lookups such as district and crop mappings in SQLite.
- Do not cache Gemma advisory across materially different ML outputs.

## Failure Handling
- If a model file is missing, log a warning during load and use fallback predictions.
- If a model raises during inference, log a warning and use fallback predictions.
- If the mandi service later fails, preserve the same endpoint shape and return a safe default trend strategy.
- If Gemma integration is not available, keep returning placeholder advisory text.

## Non-Goals For This Phase
- No production infra, deployment, or observability code yet.
- No authentication or multi-user account system yet.
- No multilingual UI implementation yet, though the design should keep room for it later.
