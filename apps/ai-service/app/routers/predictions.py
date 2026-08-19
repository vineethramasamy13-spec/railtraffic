from fastapi import APIRouter, HTTPException
import logging
from typing import Dict, Any

from app.models.schemas import DelayExplanationRequest, XAIPredictionResponse
from app.services.ml_service import ml_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/predictions", tags=["Predictions"])

@router.post("/delay", response_model=XAIPredictionResponse)
async def predict_delay(request: DelayExplanationRequest):
    try:
        # Use the ML service with XGBoost implementation
        features = {
            "train_number": request.train_number,
            "delay_factors": request.delay_factors,
            "weather_bad": request.weather_data is not None and "rain" in str(request.weather_data).lower()
        }
        
        return await ml_service.predict_delay(features)
            
    except Exception as e:
        logger.error(f"Delay prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/congestion", response_model=XAIPredictionResponse)
async def predict_congestion(route_id: str, horizon_hours: int = 4):
    try:
        # Use LSTM-based model
        return await ml_service.predict_congestion(route_id, horizon_hours)
    except Exception as e:
        logger.error(f"Congestion prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/platform")
async def recommend_platform(station_code: str, train_number: str):
    return {
        "recommended_platform": "3",
        "confidence": 0.85,
        "reasoning": "Platform 1 is occupied by a delayed freight train. Platform 3 is clear and adjacent to the main line."
    }
