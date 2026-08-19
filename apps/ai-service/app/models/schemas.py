from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal

class PageContext(BaseModel):
    current_page: str = Field(..., description="The page the user is currently viewing")
    user_role: str = Field("guest", description="Role of the current user")
    filters: Optional[Dict[str, Any]] = Field(None, description="Any active UI filters")
    selected_station: Optional[str] = Field(None, description="Currently selected station code")
    selected_train: Optional[str] = Field(None, description="Currently selected train number")

class Message(BaseModel):
    role: str = Field(..., description="Role of the sender (user, assistant, system)")
    content: str = Field(..., description="Content of the message")

class ChatRequest(BaseModel):
    messages: List[Message] = Field(..., description="Chat history")
    page_context: Optional[PageContext] = Field(None, description="Context of the user's current view")
    session_id: str = Field(..., description="Unique session ID for conversation memory")
    stream: bool = Field(False, description="Whether to stream the response")

class RAGSource(BaseModel):
    document_id: str
    document_name: str
    page_number: Optional[int] = None
    excerpt: str
    relevance_score: float

class ChatResponse(BaseModel):
    content: str
    sources: Optional[List[RAGSource]] = None
    model_used: str
    tokens: Dict[str, int] = Field(default_factory=dict)

class DelayExplanationRequest(BaseModel):
    train_id: str
    train_number: str
    current_status: Dict[str, Any]
    delay_factors: List[Dict[str, Any]]
    weather_data: Optional[Dict[str, Any]] = None

class DelayExplanationResponse(BaseModel):
    train_id: str
    explanation: str
    primary_factor: str
    confidence_score: float
    recommendation: str

class ReportSummaryRequest(BaseModel):
    report_type: str
    data: Dict[str, Any]
    timeframe: str

class ReportSummaryResponse(BaseModel):
    summary: str
    key_findings: List[str]
    action_items: List[str]

class DocumentIndexRequest(BaseModel):
    content: str
    metadata: Dict[str, Any]

class HealthResponse(BaseModel):
    status: str
    version: str
    components: Dict[str, str]

class PredictionFactor(BaseModel):
    name: str
    impact: float
    direction: Literal["positive", "negative"]
    description: str
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]

class XAIPredictionResponse(BaseModel):
    prediction_value: float
    unit: str
    confidence: float
    factors: List[PredictionFactor]
    suggested_actions: List[str]
    model_name: str
    model_version: str
    shap_summary: Optional[Dict[str, float]]
    explanation_text: str

