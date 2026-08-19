import logging
from typing import TypedDict, Annotated, List, Dict, Any, Sequence
from langgraph.graph import StateGraph, END
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
import json

from app.services.llm_service import llm_service
from app.services.rag_service import rag_service

logger = logging.getLogger(__name__)

# State definition
class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], "The chat messages so far"]
    query: str
    context: Dict[str, Any]
    retrieved_docs: List[Dict[str, Any]]
    train_data: Dict[str, Any]
    kpi_data: Dict[str, Any]
    maintenance_data: Dict[str, Any]
    incident_data: Dict[str, Any]
    final_answer: str
    query_type: str

class RailAgent:
    def __init__(self):
        self.graph = self._build_graph()

    def _build_graph(self) -> StateGraph:
        workflow = StateGraph(AgentState)

        # Add nodes
        workflow.add_node("classify_query", self.classify_query)
        workflow.add_node("retrieve_docs", self.retrieve_docs)
        workflow.add_node("fetch_train_data", self.fetch_train_data)
        workflow.add_node("analyze_kpis", self.analyze_kpis)
        workflow.add_node("explain_chart", self.explain_chart)
        workflow.add_node("compare_historical", self.compare_historical)
        workflow.add_node("recommend_route_change", self.recommend_route_change)
        workflow.add_node("draft_incident_report", self.draft_incident_report)
        workflow.add_node("analyze_alert", self.analyze_alert)
        workflow.add_node("get_maintenance_risk", self.get_maintenance_risk)
        workflow.add_node("generate_response", self.generate_response)

        # Set entry point
        workflow.set_entry_point("classify_query")

        # Add conditional edges
        workflow.add_conditional_edges(
            "classify_query",
            self.route_query,
            {
                "document_search": "retrieve_docs",
                "train_status": "fetch_train_data",
                "kpi_analysis": "analyze_kpis",
                "chart_explain": "explain_chart",
                "historical_trend": "compare_historical",
                "route_opt": "recommend_route_change",
                "incident_draft": "draft_incident_report",
                "alert_analysis": "analyze_alert",
                "maintenance_risk": "get_maintenance_risk",
                "general": "generate_response"
            }
        )

        # Add normal edges
        for node in ["retrieve_docs", "fetch_train_data", "analyze_kpis", "explain_chart", 
                    "compare_historical", "recommend_route_change", "draft_incident_report", 
                    "analyze_alert", "get_maintenance_risk"]:
            workflow.add_edge(node, "generate_response")
        
        workflow.add_edge("generate_response", END)

        return workflow.compile()

    async def classify_query(self, state: AgentState) -> AgentState:
        """Classify the user's query intent."""
        query = state["query"]
        
        # Simple heuristic classification for demo purposes
        # In production, use an LLM call or intent classifier model
        query_lower = query.lower()
        if any(word in query_lower for word in ["manual", "rule", "sop", "guideline", "procedure", "policy", "safety"]):
            query_type = "document_search"
        elif any(word in query_lower for word in ["train", "status", "delay", "platform", "running"]):
            query_type = "train_status"
        elif any(word in query_lower for word in ["kpi", "performance", "metrics"]):
            query_type = "kpi_analysis"
        elif any(word in query_lower for word in ["chart", "graph", "plot"]):
            query_type = "chart_explain"
        elif any(word in query_lower for word in ["trend", "history", "past", "historical"]):
            query_type = "historical_trend"
        elif any(word in query_lower for word in ["route", "reroute", "optimize", "path"]):
            query_type = "route_opt"
        elif any(word in query_lower for word in ["incident", "report", "draft"]):
            query_type = "incident_draft"
        elif any(word in query_lower for word in ["alert", "warning", "root cause"]):
            query_type = "alert_analysis"
        elif any(word in query_lower for word in ["maintenance", "risk", "failure", "health"]):
            query_type = "maintenance_risk"
        else:
            query_type = "general"
            
        return {**state, "query_type": query_type}

    def route_query(self, state: AgentState) -> str:
        """Route to the appropriate node based on classification."""
        return state["query_type"]

    async def retrieve_docs(self, state: AgentState) -> AgentState:
        """Retrieve relevant documents using RAG."""
        query = state["query"]
        docs = await rag_service.search(query)
        return {**state, "retrieved_docs": docs}

    async def fetch_train_data(self, state: AgentState) -> AgentState:
        """Fetch live train data (demo provider adapter)."""
        # In a real app, this would call external APIs or DBs
        query = state["query"]
        
        # Extract train number (demo provider logic)
        import re
        numbers = re.findall(r'\d{5}', query)
        train_number = numbers[0] if numbers else "12951"
        
        demo_data = {
            "train_number": train_number,
            "status": "Delayed by 45 mins",
            "last_station": "NDLS",
            "next_station": "BCT"
        }
        
        return {**state, "train_data": demo_data}

    async def analyze_kpis(self, state: AgentState) -> AgentState:
        return {**state, "kpi_data": {"punctuality": "82%", "analysis": "Historical replay dataset indicates drop due to fog."}}

    async def explain_chart(self, state: AgentState) -> AgentState:
        return state

    async def compare_historical(self, state: AgentState) -> AgentState:
        return state

    async def recommend_route_change(self, state: AgentState) -> AgentState:
        return state

    async def draft_incident_report(self, state: AgentState) -> AgentState:
        return {**state, "incident_data": {"draft": "Incident report drafted from historical replay dataset."}}

    async def analyze_alert(self, state: AgentState) -> AgentState:
        return state

    async def get_maintenance_risk(self, state: AgentState) -> AgentState:
        from app.services.ml_service import ml_service
        # Get demo data
        risk = await ml_service.predict_maintenance("asset-123", {"type": "track"})
        return {**state, "maintenance_data": {"risk": risk.model_dump()}}


    async def generate_response(self, state: AgentState) -> AgentState:
        """Generate final response using LLM."""
        messages = [{"role": m.type, "content": m.content} for m in state["messages"]]
        
        # Add context from retrieved data
        system_prompt = "You are RailCopilot, an AI assistant for the Indian Railways Traffic Management System.\n"
        
        if state.get("retrieved_docs"):
            system_prompt += "\nRelevant Document Excerpts:\n"
            for doc in state["retrieved_docs"]:
                system_prompt += f"- {doc['excerpt']} (Source: {doc['document_name']})\n"
                
        if state.get("train_data"):
            system_prompt += f"\nLive Train Data:\n{json.dumps(state['train_data'], indent=2)}\n"
            
        system_prompt += "\nUse the provided information to answer the user's query accurately."
        
        # Prepend system prompt
        full_messages = [{"role": "system", "content": system_prompt}] + messages
        
        response = await llm_service.generate_response(full_messages)
        
        return {**state, "final_answer": response["content"]}

    async def process_query(self, query: str, chat_history: List[Dict[str, str]], context: Dict[str, Any]) -> Dict[str, Any]:
        """Entry point for the agent."""
        
        # Convert history
        langchain_msgs = []
        for msg in chat_history:
            if msg["role"] == "user":
                langchain_msgs.append(HumanMessage(content=msg["content"]))
            elif msg["role"] == "assistant":
                langchain_msgs.append(AIMessage(content=msg["content"]))
                
        # Add current query
        langchain_msgs.append(HumanMessage(content=query))
        
        initial_state = AgentState(
            messages=langchain_msgs,
            query=query,
            context=context,
            retrieved_docs=[],
            train_data={},
            kpi_data={},
            maintenance_data={},
            incident_data={},
            final_answer="",
            query_type=""
        )
        
        # Run graph
        final_state = await self.graph.ainvoke(initial_state)
        
        return {
            "content": final_state["final_answer"],
            "sources": final_state.get("retrieved_docs", []),
            "model_used": "groq", # Defaulting
            "tokens": {}
        }

# Global instance
rail_agent = RailAgent()
