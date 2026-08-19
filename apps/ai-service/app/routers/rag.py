from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from typing import List, Optional
import os
import shutil
import logging

from app.models.schemas import DocumentIndexRequest
from app.services.rag_service import rag_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/rag", tags=["RAG Pipeline"])

@router.post("/index")
async def index_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    category: str = Form(...),
    title: str = Form(...)
):
    try:
        # Read file content (simplified for txt, in production use PyPDF2/docx2txt based on content_type)
        content = await file.read()
        text_content = content.decode("utf-8", errors="ignore")
        
        metadata = {
            "source": file.filename,
            "title": title,
            "category": category,
            "content_type": file.content_type
        }
        
        # Process in background
        background_tasks.add_task(rag_service.add_document, text_content, metadata)
        
        return {"status": "processing", "message": f"Document '{title}' queued for indexing"}
        
    except Exception as e:
        logger.error(f"Index error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
async def query_documents(query: str, k: int = 5, category: Optional[str] = None):
    try:
        filter_dict = {"category": category} if category else None
        results = await rag_service.search(query, k=k, filter_dict=filter_dict)
        return {"query": query, "results": results}
    except Exception as e:
        logger.error(f"Query error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/seed")
async def seed_sample_documents(background_tasks: BackgroundTasks):
    """Seed the RAG database with sample documents from the data directory"""
    try:
        sample_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "sample_documents")
        
        if not os.path.exists(sample_dir):
            return {"status": "error", "message": f"Sample directory not found at {sample_dir}"}
            
        files = os.listdir(sample_dir)
        processed = 0
        
        for filename in files:
            if not filename.endswith(".txt"):
                continue
                
            filepath = os.path.join(sample_dir, filename)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                
            category = "general"
            if "safety" in filename: category = "safety"
            elif "sop" in filename: category = "sop"
            elif "operations" in filename: category = "operations"
            elif "emergency" in filename: category = "emergency"
            
            metadata = {
                "source": filename,
                "title": filename.replace(".txt", "").replace("_", " ").title(),
                "category": category
            }
            
            await rag_service.add_document(content, metadata)
            processed += 1
            
        return {"status": "success", "message": f"Seeded {processed} documents successfully"}
    except Exception as e:
        logger.error(f"Seed error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
