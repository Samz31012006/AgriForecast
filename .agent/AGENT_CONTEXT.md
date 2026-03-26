# AgriForecast Agent Context

## Product Definition
AgriForecast is a production-grade MVP for Indian farmers that combines machine learning predictions, mandi price intelligence, and LLM-generated advisory to help users decide what to sell and when to sell it.

The MVP focuses on three outcomes:
- predict likely crop yield
- forecast mandi prices
- provide actionable selling advice in a structured, easy-to-read format

## Goals
- Deliver a mobile-first farmer workflow that starts with `state`, `district`, and `crop`.
- Keep predictions deterministic and auditable through ML models, not LLM reasoning.
- Convert predictions and mandi context into understandable advice with Gemma 27B.
- Ship an MVP that can run locally with SQLite and exported model artifacts.

## Stack
- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI
- ML: XGBoost for yield prediction, Prophet for mandi price forecasting
- LLM: Google AI Studio, Gemma 27B, advisory only
- Database: SQLite

## Constraints
- This phase is documentation and system design only. No backend or frontend feature code should be added yet.
- All architectural decisions must be documented under `.agent/`.
- Free data sources only: Agmarknet, data.gov.in, ICRISAT, IMD rainfall, Soil Health Card data.
- API keys, model access, and credentials must never be assumed. The user must provide them manually.
- ML handles predictions. LLM handles explanations and recommendations only.

## MVP Definition
The MVP accepts a farmer's location and crop selection, enriches the request with cached and historical data, predicts expected yield, forecasts mandi price direction, and returns a response with numeric outputs plus selling guidance.

MVP outputs:
- estimated crop yield
- predicted mandi price trend or range
- suggested sell/wait recommendation with explanation
- supporting metadata such as timestamp, source freshness, and model version

## System Flow Summary
1. User selects `state`, `district`, and `crop` in the mobile-first UI.
2. FastAPI validates and normalizes the request.
3. Backend fetches or loads supporting data such as mandi prices, rainfall history, and static soil or regional features.
4. Yield model produces the numeric yield prediction.
5. Price model produces the mandi price forecast.
6. Backend assembles a structured advisory prompt from the ML outputs and market context.
7. Gemma 27B returns natural-language guidance and structured recommendations.
8. API responds with separated sections for ML predictions, market context, and advisory.

## Context Maintenance Rule
- Update this file whenever product scope, goals, stack, or MVP boundaries change.
- Keep all `.agent/` files aligned with the current implementation direction.
