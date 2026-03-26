# API Integrations

## Integration Principles
- Use free data sources only for the MVP.
- Treat every external dependency as optional at runtime and expose freshness or fallback metadata in responses.
- Never let the LLM generate numeric predictions. It only interprets structured backend outputs.

## Google AI Studio: Gemma 27B
- Purpose: advisory only
- Provider: Google AI Studio
- Model: `gemma-2-27b-it`
- Auth requirement: Valid `GOOGLE_API_KEY` stored in `.env`
- Invocation: Post-prediction backend service call.
- Prompt: Expert agricultural advisory limited to 2 sentences of clear, practical selling advice.

Expected advisory input (from `main.py`):
- crop: string
- yield: tons/hectare
- price: ₹ value
- trend: stable/rising/falling

Advisory output requirement:
- Direct, 2-sentence selling recommendation.
- Return text only, no markdown or complex schema in string.
- Fallback logic: returns a structured generic string if API fails or key is missing.

## Agmarknet Integration
- Purpose: fetch mandi price records for selected crop and geography
- Likely implementation: scraping or ingest adapter due to inconsistent public API availability
- Data captured:
  - mandi name
  - arrival date
  - modal price
  - min price
  - max price
  - commodity and district identifiers

Normalization rules:
- convert crop aliases to canonical crop names
- normalize district and state labels against backend reference data
- parse prices into numeric INR values
- stamp each ingestion with fetch time and source date

Failure strategy:
- use latest cached Agmarknet snapshot when fresh fetch fails
- return source freshness metadata to the client

## Weather Fallback
- Primary use: feature enrichment for yield and price context when historical rainfall context is missing from offline datasets
- Preferred data basis: IMD rainfall dataset when available in the training pipeline
- Fallback runtime provider: free weather API selected during implementation if online enrichment is still required
- Auth requirement: do not assume any weather API key exists; request one from the user only if a chosen provider needs it

Expected weather fields:
- rainfall totals
- temperature bands if needed by the chosen feature schema
- observation date range
- geography reference

## Planned Backend Endpoints
- `POST /api/v1/predict`
  - main MVP endpoint
  - validates request, runs ML services, fetches market context, invokes Gemma, returns final structured response
- `GET /api/v1/health`
  - lightweight service health check
- `GET /api/v1/metadata/locations`
  - returns available states and districts for UI selectors
- `GET /api/v1/metadata/crops`
  - returns supported crops and aliases

## Response Format Notes
- Prediction responses must separate machine outputs from advisory outputs.
- External-source metadata should include freshness timestamps and fallback flags.
- Error responses should distinguish validation failures, dependency failures, and model-loading failures.

## Maintenance Rule
- Update this file whenever providers, auth method, endpoints, fallback behavior, or response shapes change.
