import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from prometheus_fastapi_instrumentator import Instrumentator
import logging

from app.core.middleware import LoggingMiddleware
from app.routers import chat, rag, predictions, reports, health, maintenance
from app.config import settings

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create app
app = FastAPI(
    title="RailTraffic Platform - AI Service",
    description="AI capabilities for India's Railway Traffic Management Platform (SIH25022)",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Middlewares
app.add_middleware(LoggingMiddleware)

# Setup Prometheus metrics
Instrumentator().instrument(app).expose(app)

# Include Routers
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(rag.router)
app.include_router(predictions.router)
app.include_router(reports.router)
app.include_router(maintenance.router)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting AI Service...")
    
    # Initialize RAG and seed if empty (in a real app, this would be a separate script or flag)
    try:
        from app.services.rag_service import rag_service
        # Here you might call rag_service.seed() if needed automatically
        logger.info("RAG Service initialized")
    except Exception as e:
        logger.error(f"Failed to initialize RAG during startup: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down AI Service...")
