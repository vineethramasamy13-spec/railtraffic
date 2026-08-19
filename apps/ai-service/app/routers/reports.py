from fastapi import APIRouter, HTTPException
import logging
import json

from app.models.schemas import ReportSummaryRequest, ReportSummaryResponse
from app.services.llm_service import llm_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/reports", tags=["Reports"])

@router.post("/summary", response_model=ReportSummaryResponse)
async def generate_summary(request: ReportSummaryRequest):
    try:
        prompt = f"""
        Generate an executive summary for a {request.report_type} report covering the timeframe: {request.timeframe}.
        
        Raw Data:
        {json.dumps(request.data, indent=2)}
        
        Provide your response in strict JSON format with these exact keys:
        - "summary": A comprehensive 1-2 paragraph executive summary.
        - "key_findings": A list of 3-5 strings detailing the most critical findings.
        - "action_items": A list of 2-4 strings detailing recommended immediate actions.
        """
        
        messages = [{"role": "user", "content": prompt}]
        response = await llm_service.generate_response(messages, require_json=True)
        
        try:
            content = response["content"]
            if content.startswith("```json"):
                content = content[7:-3]
            elif content.startswith("```"):
                content = content[3:-3]
                
            parsed = json.loads(content)
            
            return ReportSummaryResponse(
                summary=parsed.get("summary", ""),
                key_findings=parsed.get("key_findings", []),
                action_items=parsed.get("action_items", [])
            )
        except json.JSONDecodeError:
            raise ValueError("Invalid JSON from LLM")
            
    except Exception as e:
        logger.error(f"Report summary error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
