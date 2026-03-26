# ML Pipeline

## Training Environment
- All model training must run in Google Colab.
- Local backend only consumes exported artifacts and never retrains models.

## Data Sources
- data.gov.in crop yield data
- ICRISAT datasets for regional agricultural signals
- IMD rainfall dataset
- Soil Health Card data
- Agmarknet historical mandi prices for price forecasting

## Pipeline Stages
1. Load raw datasets into Colab from user-provided files, drive links, or mounted storage.
2. Standardize crop, state, and district naming across all sources.
3. Clean missing values, resolve date formats, and remove unusable records.
4. Build features for yield prediction and price forecasting.
5. Split training and validation data using time-aware logic where appropriate.
6. Train XGBoost model for yield prediction.
7. Train Prophet model for price forecasting.
8. Evaluate both models and document key metrics in the notebook output.
9. Export production artifacts for backend serving.

## Preprocessing Requirements
- Define canonical keys for `state`, `district`, and `crop`.
- Store derived feature names and types in `feature_schema.json`.
- Preserve unit conventions such as rainfall totals and prices in INR.
- Ensure inference-time defaults match training-time assumptions.

## Export Artifacts
The Colab workflow must export exactly:
- `yield_model.pkl`
- `price_model.pkl`
- `feature_schema.json`

Optional supporting outputs:
- model metrics report
- sample inference rows
- dataset version notes

## Backend Loading Contract
- FastAPI loads model artifacts during application startup or first-use warmup.
- Backend must verify artifact existence before serving predictions.
- Backend must validate generated feature vectors against `feature_schema.json` before model inference.
- If schema validation fails, backend must reject the request rather than silently coercing fields.

## Inference Inputs
Minimum inference input starts from:
- `state`
- `district`
- `crop`

The backend enriches these fields with additional derived features from cached reference data and external sources before passing them to the models.

## Colab Stop Conditions
- Training cannot proceed until the user provides or uploads the required datasets.
- Backend integration cannot proceed until the exported artifacts are placed in the agreed model directory.

## Maintenance Rule
- Update this file whenever training datasets, preprocessing logic, export names, or backend loading rules change.
