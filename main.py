import sys
import os

# Absolute path to the directory containing this file
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

try:
    from backend.main import app
except ImportError:
    # Fallback for some specific cloud environments where we might already be inside backend
    try:
        from main import app
    except ImportError as e:
        print(f"CRITICAL: Could not find app. sys.path: {sys.path}")
        raise e

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
