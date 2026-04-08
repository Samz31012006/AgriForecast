from google import genai
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
        client = genai.Client(api_key=settings.google_api_key)
        
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

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"GenAI Error: {e}")
        return fallback
