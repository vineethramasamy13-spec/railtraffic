import logging
from typing import Dict, Any, List, Optional
import httpx

logger = logging.getLogger(__name__)

class MCPClientBase:
    """Base class for MCP clients."""
    pass

class PostgreSQLMCPClient(MCPClientBase):
    async def query(self, sql: str) -> List[Dict[str, Any]]:
        # Demo provider adapter
        return [{"status": "success", "data": "demo_data"}]

class FilesystemMCPClient(MCPClientBase):
    async def list_files(self, path: str) -> List[str]:
        return ["file1.txt", "file2.txt"]

class WeatherMCPClient(MCPClientBase):
    async def get_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        """Calls Open-Meteo API (free, public)"""
        try:
            url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
            async with httpx.AsyncClient() as client:
                response = await client.get(url)
                if response.status_code == 200:
                    return response.json()
                return {"error": "Weather data unavailable"}
        except Exception as e:
            logger.error(f"Weather API error: {e}")
            return {"error": str(e)}

class MapsMCPClient(MCPClientBase):
    async def get_network(self) -> Dict[str, Any]:
        """Returns GeoJSON data for railway network."""
        return {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [[77.2167, 28.6448], [72.8777, 19.0760]] # NDLS to CSMT
                    },
                    "properties": {"route": "Delhi-Mumbai Main Line"}
                }
            ]
        }

class DocumentationMCPClient(MCPClientBase):
    async def search_docs(self, query: str) -> List[Dict[str, Any]]:
        """Search the ChromaDB RAG store."""
        from app.services.rag_service import rag_service
        return await rag_service.search(query)

class OpenAPIMCPClient(MCPClientBase):
    async def get_spec(self) -> Dict[str, Any]:
        return {"openapi": "3.0.0", "info": {"title": "Railway API"}}

class MCPClientManager:
    """
    Manages connections to MCP servers.
    Servers can be enabled/disabled via config.
    """
    def __init__(self):
        self.servers = {
            "postgresql": PostgreSQLMCPClient(),
            "filesystem": FilesystemMCPClient(),
            "weather": WeatherMCPClient(),
            "maps": MapsMCPClient(),
            "documentation": DocumentationMCPClient(),
            "openapi": OpenAPIMCPClient(),
        }
        
    def get_client(self, name: str) -> Optional[MCPClientBase]:
        return self.servers.get(name)

mcp_client_manager = MCPClientManager()
