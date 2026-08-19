from fastapi import APIRouter, HTTPException
import logging
from typing import Dict, Any

from app.models.schemas import XAIPredictionResponse
from app.services.ml_service import ml_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/maintenance", tags=["Predictive Maintenance"])

@router.post("/predict-track", response_model=XAIPredictionResponse)
async def predict_track_health(asset_id: str, vibration_data: Dict[str, Any]):
    try:
        return await ml_service.predict_maintenance(asset_id, {"type": "track", "vibration": vibration_data})
    except Exception as e:
        logger.error(f"Track prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-signal", response_model=XAIPredictionResponse)
async def predict_signal_failure(asset_id: str, voltage_logs: Dict[str, Any]):
    try:
        return await ml_service.predict_maintenance(asset_id, {"type": "signal", "voltage": voltage_logs})
    except Exception as e:
        logger.error(f"Signal prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/predict-switch", response_model=XAIPredictionResponse)
async def predict_switch_failure(asset_id: str, friction_logs: Dict[str, Any]):
    try:
        return await ml_service.predict_maintenance(asset_id, {"type": "switch", "friction": friction_logs})
    except Exception as e:
        logger.error(f"Switch prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedule")
async def schedule_maintenance(asset_ids: list[str]):
    return {
        "status": "success",
        "schedule": [
            {"asset_id": asset_ids[0], "scheduled_date": "2026-08-20T02:00:00Z", "team": "Track Maintenance Alpha"}
        ]
    }

@router.get("/risk-dashboard")
async def risk_dashboard():
    return {
        "high_risk_assets": 12,
        "medium_risk_assets": 45,
        "critical_alerts": ["Signal S-14 at NDLS showing voltage drop", "Track section T-88 high vibration"],
        "overall_health_score": 88.5
    }
