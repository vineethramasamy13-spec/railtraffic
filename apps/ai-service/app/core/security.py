# Security utilities (e.g., API key validation, auth)
# For the AI service, authentication is typically handled at the API Gateway level
# But we can add basic token validation here if needed in the future.

from fastapi import Security, HTTPException, status
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def verify_api_key(api_key_header: str = Security(api_key_header)):
    """
    Verify API key if required.
    For this implementation, we assume the gateway handles auth.
    This is a placeholder for direct access.
    """
    # if api_key_header != "expected_key":
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Invalid API Key"
    #     )
    return True
