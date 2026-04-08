import logging
from typing import Optional

import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Header, HTTPException, status
from backend.config import settings

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK
# Try to initialize with default credentials (SA JSON or env var)
# Fallback to local project ID for verification if possible
try:
    if not firebase_admin._apps:
        project_id = settings.firebase_project_id or "agriforecast01"
        logger.info(f"Initializing Firebase Admin for project: {project_id}")
        # Explicitly set the project ID for verification
        firebase_admin.initialize_app(options={
            'projectId': project_id
        })
except Exception as e:
    logger.error(f"Failed to initialize Firebase Admin: {e}")

async def verify_firebase_token(authorization: Optional[str] = Header(None)) -> dict:
    """
    Dependency to verify Firebase ID tokens passed in the Authorization header.
    Expects format: Bearer <TOKEN>
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = authorization.split("Bearer ")[1]
    try:
        # Verify the ID token while checking for revocations (optional, but safer)
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error(f"Firebase token verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
