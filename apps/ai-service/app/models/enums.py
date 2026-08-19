from enum import Enum

class ModelType(str, Enum):
    GROQ = "groq"
    GEMINI = "gemini"

class DocumentCategory(str, Enum):
    SAFETY = "safety"
    SOP = "sop"
    OPERATIONS = "operations"
    EMERGENCY = "emergency"
    GENERAL = "general"
