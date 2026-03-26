import google.generativeai as genai
from backend.config import settings


def generate_advisory(
    yield_prediction: float,
    price_prediction: float,
    price_trend: str,
    crop: str,
) -> str:
    # Safe fallback if API is not configured or an error occurs
    fallback = (
        f"For {crop}, expected yield is {yield_prediction} tons/hectare. "
        f"With prices at ₹{price_prediction} and a {price_trend} trend, monitor market and sell as needed."
    )

    if not settings.google_api_key:
        return fallback

    try:
        genai.configure(api_key=settings.google_api_key)
        model = genai.GenerativeModel("models/gemma-3-27b-it")

        prompt = (
            f"You are an agricultural advisor helping Indian farmers.\n\n"
            f"Crop: {crop}\n"
            f"Predicted yield: {yield_prediction} tons/hectare\n"
            f"Predicted price: ₹{price_prediction}\n"
            f"Price trend: {price_trend}\n\n"
            "Give a short selling recommendation in 2 sentences. "
            "Be practical and clear.\n"
            "Return text only."
        )

        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception:
        return fallback
