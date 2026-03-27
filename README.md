# AgriForecast 🌿

**Precision Agriculture Platform for Indian Farmers** — empowering data-driven decisions with AI-powered yield and market price forecasting.

![AgriForecast Dashboard](public/images/aerial_farm.png)

---

## 🚀 Key Features

- **Yield Prediction**: High-precision XGBoost pipeline predicting quintals per acre based on 9 agronomic parameters.
- **Market Price Forecasting**: Ensemble model (XGBoost + Facebook Prophet) providing Mandi price trends and expected selling rates.
- **AI Agronomist Advisory**: Instant, context-aware selling strategies generated via **Google Gemma 3 27B**.
- **Cloud History & Sync**: Secure Google Sign-In with real-time prediction tracking via **Cloud Firestore**.
- **Premium UX**: Responsive glass-morphism dashboard with "Deep Emerald & Gold" aesthetic.
- **Downloadable Reports**: One-click `.txt` export of prediction results and metadata.

---

## 🏗️ System Architecture

AgriForecast uses a modern full-stack architecture optimized for low-latency ML inference and high availability:

- **Frontend**: Next.js 15+ (Turbopack) with Tailwind CSS.
- **Backend API**: FastAPI (Python) for high-speed model serving.
- **Database/Auth**: Google Firebase (Authentication & Cloud Firestore).
- **ML Engine**: 
  - **Yield**: scikit-learn XGBoost Pipeline.
  - **Price**: Ensemble (60% XGBoost Regressor | 40% FB Prophet).
  - **Advisory**: Google Gemma LLM via Generative AI SDK.

---

## 🛠️ Setup & Installation

### 1. Backend (FastAPI)
```bash
# Navigate to project root
cd AgriForecast

# Install Python dependencies
pip install -r requirements.txt

# Start the API server
uvicorn backend.main:app --port 8000 --reload
```

### 2. Frontend (Next.js)
```bash
# Install Node dependencies
npm install

# Start the development server
npm run dev -- -p 3001
```

---

## 📊 ML Pipeline Details

The platform processes nine key inputs to drive its predictions:
1. **Crop Type** (Maize, Rice, Barley, Wheat, Cotton, Soybean)
2. **Soil Type** (Sandy, Loam, Silt, etc.)
3. **Region** (North, South, West, East)
4. **Environment** (Rainfall, Temperature, Weather Condition)
5. **Management** (Irrigation, Fertilizer, Days to Harvest)

Historical market data is anchored using official **Minimum Support Prices (MSP)** to ensure accuracy across different crop species.

---

## 📂 Project Structure

- `app/` - Next.js App Router (Frontend Pages & Layouts)
- `components/` - Shared UI components (Charts, Forms, Table)
- `backend/` - FastAPI implementation
  - `models/` - Pre-trained `.pkl` ML model files
  - `model_service.py` - ML inference logic
  - `advisory_service.py` - Gemma LLM integration
- `lib/` - Client-side utilities (Firebase, API wrappers)
- `public/` - Static assets and AI-generated imagery

---

## 📄 License & Contact

Developed for Indian Farmers. 
Contact: [samarthhk1234@gmail.com](mailto:samarthhk1234@gmail.com)

© 2026 AgriForecast Platform.
