from langchain_huggingface import HuggingFaceEmbeddings
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        self.model_name = "all-MiniLM-L6-v2"
        self.embeddings = None
        self._initialize_model()

    def _initialize_model(self):
        try:
            logger.info(f"Initializing embedding model: {self.model_name}")
            self.embeddings = HuggingFaceEmbeddings(model_name=self.model_name)
        except Exception as e:
            logger.error(f"Failed to initialize embedding model: {str(e)}")
            raise

    def get_embeddings(self):
        return self.embeddings

# Global instance
embedding_service = EmbeddingService()
