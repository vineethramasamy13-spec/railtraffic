from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import json
import logging
from typing import AsyncGenerator

from app.models.schemas import ChatRequest, ChatResponse, RAGSource
from app.services.llm_service import llm_service
from app.services.rail_agent import rail_agent

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/chat", tags=["Chat"])

def build_system_prompt(page_context) -> str:
    prompt = "You are RailCopilot, the AI Railway Operations Copilot for the Indian Ministry of Railways.\n"
    prompt += "You are not a general assistant — you are a domain expert in:\n"
    prompt += "- Indian Railways operations, scheduling, and traffic management\n"
    prompt += "- Train delay analysis and prediction (using XGBoost models)\n"
    prompt += "- Congestion forecasting (using LSTM models)\n"
    prompt += "- Maintenance prediction (using Random Forest)\n"
    prompt += "- Incident classification (using BERT)\n"
    prompt += "- Route optimization (using A* + OR-Tools)\n"
    prompt += "- Railway policy and SOPs (from your RAG knowledge base)\n"
    
    if page_context:
        prompt += f"\nCurrent context:\n"
        prompt += f"- Page: {page_context.current_page}\n"
        prompt += f"- User role: {page_context.user_role}\n"
        
        # In a real scenario, these would come from an active data store
        kpi_summary = "Punctuality 82%, Asset Uptime 98%" 
        alert_count = 12
        critical_count = 3
        
        prompt += f"- Active KPIs: {kpi_summary}\n"
        prompt += f"- Active alerts: {alert_count} alerts ({critical_count} critical)\n"
        
        selected_entity = "None"
        if page_context.selected_station:
            selected_entity = page_context.selected_station
        elif page_context.selected_train:
            selected_entity = page_context.selected_train
            
        prompt += f"- Selected entity: {selected_entity}\n"
        
    prompt += """
Always:
1. Ground answers in the current application context
2. Reference specific trains, stations, and KPIs from context
3. Cite sources from the railway documentation when answering policy questions
4. Provide SHAP-style factor breakdowns when explaining predictions
5. Suggest specific actionable next steps
6. Acknowledge your data source (historical replay dataset vs live API)
"""
    return prompt

@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # Build messages list
        system_prompt = build_system_prompt(request.page_context)
        messages = [{"role": "system", "content": system_prompt}]
        
        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})
            
        # Get latest query
        latest_query = request.messages[-1].content if request.messages else ""
        
        # If complex query, route to agent
        if len(latest_query.split()) > 5: # Simple heuristic
            context_dict = request.page_context.model_dump() if request.page_context else {}
            
            # Pass to agent
            # Extract history (excluding last message which is the query)
            history_dicts = [{"role": m.role, "content": m.content} for m in request.messages[:-1]]
            
            result = await rail_agent.process_query(latest_query, history_dicts, context_dict)
            
            # Format sources if any
            sources = []
            if result.get("sources"):
                for s in result["sources"]:
                    sources.append(RAGSource(
                        document_id=s["document_id"],
                        document_name=s["document_name"],
                        page_number=s.get("page_number"),
                        excerpt=s["excerpt"],
                        relevance_score=s["relevance_score"]
                    ))
                    
            return ChatResponse(
                content=result["content"],
                sources=sources if sources else None,
                model_used=result["model_used"],
                tokens=result.get("tokens", {})
            )
        else:
            # Simple direct LLM call
            response = await llm_service.generate_response(messages)
            return ChatResponse(
                content=response["content"],
                model_used=response["model_used"],
                tokens=response.get("tokens", {})
            )
            
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stream")
async def chat_stream(request: ChatRequest):
    try:
        system_prompt = build_system_prompt(request.page_context)
        messages = [{"role": "system", "content": system_prompt}]
        
        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})

        async def stream_generator() -> AsyncGenerator[str, None]:
            try:
                async for chunk in llm_service.generate_stream(messages):
                    # Format as Server-Sent Events (SSE) or simple text
                    # For simple integration with React fetch, yielding JSON lines is often easiest
                    yield json.dumps({"content": chunk}) + "\n"
            except Exception as e:
                logger.error(f"Streaming error: {str(e)}")
                yield json.dumps({"error": str(e)}) + "\n"

        return StreamingResponse(stream_generator(), media_type="application/x-ndjson")
        
    except Exception as e:
        logger.error(f"Stream setup error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
