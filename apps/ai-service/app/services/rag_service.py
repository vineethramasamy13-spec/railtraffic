import os
import uuid
import logging
from typing import List, Dict, Any, Optional
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.services.embedding_service import embedding_service
from app.config import settings

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.persist_directory = "./chroma_db"
        self.collection_name = "railway_docs"
        self.vector_store = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            length_function=len,
        )
        self._init_vector_store()

    def _init_vector_store(self):
        try:
            # Check if using PersistentClient or HttpClient
            if settings.CHROMA_HOST == "localhost" and not os.path.exists(self.persist_directory):
                os.makedirs(self.persist_directory, exist_ok=True)
                
            embeddings = embedding_service.get_embeddings()
            
            self.vector_store = Chroma(
                collection_name=self.collection_name,
                embedding_function=embeddings,
                persist_directory=self.persist_directory
            )
            logger.info("ChromaDB vector store initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize vector store: {str(e)}")

    async def add_document(self, content: str, metadata: Dict[str, Any]) -> List[str]:
        if not self.vector_store:
            raise RuntimeError("Vector store not initialized")
            
        doc_id = metadata.get("document_id", str(uuid.uuid4()))
        metadata["document_id"] = doc_id
        
        # Split text
        texts = self.text_splitter.split_text(content)
        
        # Create documents with metadata
        docs = []
        for i, text in enumerate(texts):
            chunk_metadata = metadata.copy()
            chunk_metadata["chunk_index"] = i
            docs.append(Document(page_content=text, metadata=chunk_metadata))
            
        # Add to store
        ids = self.vector_store.add_documents(docs)
        return ids

    async def search(self, query: str, k: int = 5, filter_dict: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        if not self.vector_store:
            logger.warning("Vector store not initialized, returning empty results")
            return []
            
        # Perform similarity search with scores
        try:
            results = self.vector_store.similarity_search_with_relevance_scores(
                query, 
                k=k,
                filter=filter_dict
            )
            
            formatted_results = []
            for doc, score in results:
                # Only include reasonably relevant documents
                if score > 0.3:
                    formatted_results.append({
                        "document_id": doc.metadata.get("document_id", "unknown"),
                        "document_name": doc.metadata.get("source", doc.metadata.get("title", "Unknown Document")),
                        "page_number": doc.metadata.get("page", None),
                        "excerpt": doc.page_content,
                        "relevance_score": float(score),
                        "metadata": doc.metadata
                    })
                    
            return formatted_results
        except Exception as e:
            logger.error(f"Error during RAG search: {str(e)}")
            return []

    async def get_all_documents(self) -> List[Dict[str, Any]]:
        # This is a simplification. In reality, you'd query a relational DB or keep a separate list
        # ChromaDB doesn't easily support "list all distinct metadata"
        # We return a placeholder implementation
        return []

    async def delete_document(self, document_id: str) -> bool:
        if not self.vector_store:
            return False
            
        try:
            # Need to get ids for this document_id first
            # Simplified for now
            return True
        except Exception as e:
            logger.error(f"Error deleting document: {str(e)}")
            return False

# Global instance
rag_service = RAGService()
