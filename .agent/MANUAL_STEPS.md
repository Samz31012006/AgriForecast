# Manual Steps

## STOP HERE: Confirm Project Direction
- Review the `.agent/` files and confirm the MVP direction before implementation starts.
- Share any changes in crop scope, geography scope, or advisory expectations before code is written.

## STOP HERE: Provide Google AI Studio Access
- Provide a valid Google AI Studio API key for Gemma 27B integration.
- Do not assume the key already exists in the environment.
- Confirm whether the target model is available to your account before backend integration begins.

## STOP HERE: Provide External API Credentials If Needed
- If the chosen weather fallback provider requires an API key, provide it before runtime integration.
- If no free keyless provider is acceptable, implementation must pause until credentials are available.

## STOP HERE: Gather Training Data
- Download or provide access to the required free datasets:
  - Agmarknet historical mandi data
  - data.gov.in crop yield data
  - ICRISAT dataset
  - IMD rainfall dataset
  - Soil Health Card data

## STOP HERE: Train Models In Colab
- Run the training pipeline in Google Colab only.
- Export these exact files:
  - `yield_model.pkl`
  - `price_model.pkl`
  - `feature_schema.json`
- Record dataset versions and model metrics for reference.

## STOP HERE: Place Model Files
- Put the exported model artifacts into the backend model directory chosen during implementation.
- Backend work that depends on inference should pause until the files are present.

## STOP HERE: Confirm Push Access
- Before any future push, confirm you have collaborator access or valid credentials for `https://github.com/rohanhegde2025-droid/AgriForecast`.
- We are not pushing in this phase.

## STOP HERE: Run Backend
- After backend implementation exists, install dependencies and start FastAPI locally.
- Verify health and prediction endpoints before connecting the UI.

## STOP HERE: Run Frontend
- After frontend implementation exists, install dependencies and start the Next.js app locally.
- Verify the mobile-first flow from dashboard to prediction view.
