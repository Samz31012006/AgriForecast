# Build Flow

## Ordered Delivery Plan
1. Context
   - create and align all `.agent/` source-of-truth files
   - confirm scope, contracts, and manual dependencies
2. Backend skeleton
   - create FastAPI project structure, settings, routers, and service boundaries
3. Model loader
   - add artifact loading, schema validation, and startup checks
4. Prediction endpoint
   - implement request validation, feature building, and model orchestration
5. Mandi integration
   - add Agmarknet ingestion, normalization, caching, and freshness metadata
6. Gemma integration
   - add Google AI Studio advisory service with strict ML-versus-LLM separation
7. UI build
   - create Next.js App Router layout and mobile-first shadcn components
8. UI integration
   - connect form flow to backend contracts and render results states
9. Testing
   - validate contracts, endpoint behavior, fallback logic, and critical UI paths

## Rules For Future Work
- If architecture changes, update `.agent/ARCHITECTURE.md`.
- If API behavior changes, update `.agent/API_INTEGRATIONS.md`.
- If UI changes, update `.agent/UI_SPEC.md`.
- If feature schema or training logic changes, update `.agent/ML_PIPELINE.md` and `.agent/DATA_CONTRACTS.md`.

## Stop Condition For This Phase
- Stop after context creation.
- Do not begin backend or frontend coding in this phase.
