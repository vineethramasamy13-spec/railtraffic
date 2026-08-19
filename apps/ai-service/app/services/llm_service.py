import logging
from typing import List, Dict, Any, AsyncGenerator, Optional
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, BaseMessage
from app.config import settings

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        self.groq_model = settings.GROQ_MODEL
        self.gemini_model = settings.GEMINI_MODEL
        
        self.primary_llm = None
        self.fallback_llm = None
        
        self._initialize_models()

    def _initialize_models(self):
        if settings.GROQ_API_KEY:
            self.primary_llm = ChatGroq(
                temperature=0.2,
                model_name=self.groq_model,
                groq_api_key=settings.GROQ_API_KEY,
                max_tokens=2048,
            )
        else:
            logger.warning("GROQ_API_KEY not set. Primary LLM unavailable.")

        if settings.GEMINI_API_KEY:
            self.fallback_llm = ChatGoogleGenerativeAI(
                model=self.gemini_model,
                google_api_key=settings.GEMINI_API_KEY,
                temperature=0.2,
                max_tokens=2048,
            )
        else:
            logger.warning("GEMINI_API_KEY not set. Fallback LLM unavailable.")

    def _convert_messages(self, messages: List[Dict[str, str]]) -> List[BaseMessage]:
        converted = []
        for msg in messages:
            if msg["role"] == "system":
                converted.append(SystemMessage(content=msg["content"]))
            elif msg["role"] == "user":
                converted.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                converted.append(AIMessage(content=msg["content"]))
        return converted

    async def generate_response(self, messages: List[Dict[str, str]], require_json: bool = False) -> Dict[str, Any]:
        """Generate response with automatic fallback"""
        langchain_msgs = self._convert_messages(messages)
        
        try:
            if not self.primary_llm:
                raise ValueError("Primary LLM (Groq) not configured.")
            
            # Request JSON if needed (Note: ChatGroq kwargs handling varies, simple approach here)
            llm = self.primary_llm
            if require_json:
                llm = self.primary_llm.bind(response_format={"type": "json_object"})
                
            response = await llm.ainvoke(langchain_msgs)
            
            return {
                "content": response.content,
                "model_used": "groq",
                "tokens": {"total": 0} # Placeholder as token counts may require specific callbacks
            }
            
        except Exception as e:
            logger.error(f"Primary LLM failed: {str(e)}. Falling back to Gemini.")
            if not self.fallback_llm:
                raise RuntimeError(f"Primary LLM failed and fallback not configured. Error: {str(e)}")
            
            try:
                llm = self.fallback_llm
                response = await llm.ainvoke(langchain_msgs)
                return {
                    "content": response.content,
                    "model_used": "gemini",
                    "tokens": {"total": 0}
                }
            except Exception as fallback_error:
                logger.error(f"Fallback LLM also failed: {str(fallback_error)}")
                raise RuntimeError(f"Both primary and fallback LLMs failed. Fallback error: {str(fallback_error)}")

    async def generate_stream(self, messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        """Generate streaming response with automatic fallback"""
        langchain_msgs = self._convert_messages(messages)
        
        try:
            if not self.primary_llm:
                raise ValueError("Primary LLM (Groq) not configured.")
                
            async for chunk in self.primary_llm.astream(langchain_msgs):
                if chunk.content:
                    yield chunk.content
                    
        except Exception as e:
            logger.error(f"Primary LLM stream failed: {str(e)}. Attempting fallback stream.")
            if not self.fallback_llm:
                yield f"\n\n[Error: AI service unavailable: {str(e)}]"
                return
                
            try:
                # Yield a notice that we're using fallback if we already started streaming
                # yield "\n\n[Switched to fallback model]\n\n"
                async for chunk in self.fallback_llm.astream(langchain_msgs):
                    if chunk.content:
                        yield chunk.content
            except Exception as fallback_error:
                logger.error(f"Fallback stream failed: {str(fallback_error)}")
                yield f"\n\n[Critical Error: Both AI models failed to respond.]"

# Global instance
llm_service = LLMService()
