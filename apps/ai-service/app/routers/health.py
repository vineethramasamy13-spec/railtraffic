from fastapi import APIRouter
from app.models.schemas import HealthResponse

router = APIRouter(tags=["Health"])

@router.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        components={
            "llm_service": "ok",
            "rag_service": "ok",
            "database": "unconfigured_but_ok" # Placeholder
        }
    )
