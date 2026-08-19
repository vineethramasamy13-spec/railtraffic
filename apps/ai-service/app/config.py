from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    """Application settings using Pydantic BaseSettings."""
    
    # API Keys
    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # ChromaDB Settings
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    
    # Redis Settings
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Database Settings
    DATABASE_URL: Optional[str] = None
    
    # Application Settings
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    
    # Model Configuration
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GEMINI_MODEL: str = "gemini-1.5-pro"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

# Global settings instance
settings = Settings()
