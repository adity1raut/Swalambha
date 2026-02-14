from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain.docstore.document import Document
from langchain.prompts import PromptTemplate
import os
import fitz
from dotenv import load_dotenv
import logging
from langchain_community.vectorstores import FAISS
import firebase_admin
from firebase_admin import credentials, firestore
from functools import lru_cache
import asyncio
from typing import List
import concurrent.futures
import hashlib
import time
from pathlib import Path
# Load environment variables
load_dotenv()

app = FastAPI(title="RAG Chatbot API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global variables
db = None
vector_store = None
document_cache = {}

# Initialize Firebase
def initialize_firebase():
    global db
    try:
        if not firebase_admin._apps:
            cred_path = os.getenv("FIREBASE_CRED_PATH", "firebase-credentials.json")
            if not os.path.exists(cred_path):
                logger.warning(f"Firebase credentials file not found at {cred_path}. Using mock storage.")
                return None
                
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred, {
                'databaseURL': 'https://chatbot-9ae54.firebaseio.com/'
            })
            db = firestore.client()
            logger.info("Firebase initialized successfully")
        return db
    except Exception as e:
        logger.error(f"Firebase initialization failed: {str(e)}")
        return None

# Initialize Firebase on startup
db = initialize_firebase()

# Cache embedding model
@lru_cache(maxsize=1)
def get_embedding_model():
    try:
        return HuggingFaceEmbeddings(
            model_name="all-MiniLM-L6-v2",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'normalize_embeddings': True}
        )
    except Exception as e:
        logger.error(f"Error loading embedding model: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to load embedding model")

# Cache text splitter with better parameters
@lru_cache(maxsize=1)
def get_text_splitter():
    return RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,  # Increased overlap for better context
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""]
    )

# Cache LLM with better configuration
@lru_cache(maxsize=1)
def get_gemini_llm():
    try:
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("Missing Gemini API Key. Please set GEMINI_API_KEY in environment variables.")
        
        return ChatGoogleGenerativeAI(
            google_api_key=gemini_api_key,
            model="gemini-2.5-flash", 
            temperature=0.3,
            max_tokens=2048,
            convert_system_message_to_human=True
        )
    except Exception as e:
        logger.error(f"Error initializing Gemini LLM: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize LLM")

# Custom prompt template for better responses
def get_qa_prompt():
    template = """You are a helpful AI assistant that answers questions based on the provided context. 
Use the following pieces of context to answer the question at the end. 

If you don't know the answer based on the context, just say "I don't have enough information to answer this question based on the provided documents."

Context:
{context}

Question: {question}

Answer: Provide a detailed and accurate answer based strictly on the context above."""

    return PromptTemplate(
        template=template,
        input_variables=["context", "question"]
    )

# Dependency to get required components
def get_components():
    try:
        return {
            "embedding_fn": get_embedding_model(),
            "text_splitter": get_text_splitter()
        }
    except Exception as e:
        logger.error(f"Error getting components: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to initialize components")

# Enhanced PDF text extraction with better error handling
async def extract_text_from_pdf(file_path: str) -> str:
    try:
        loop = asyncio.get_event_loop()
        with concurrent.futures.ThreadPoolExecutor() as pool:
            text = await loop.run_in_executor(pool, _extract_text_from_pdf, file_path)
        
        if not text or len(text.strip()) < 10:
            raise ValueError("PDF appears to be empty or contains no extractable text")
        
        return text
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {str(e)}")
        raise ValueError(f"Error extracting text from PDF: {str(e)}")

def _extract_text_from_pdf(file_path: str) -> str:
    text = ""
    try:
        with fitz.open(file_path) as doc:
            for page_num, page in enumerate(doc):
                try:
                    page_text = page.get_text("text")
                    if page_text.strip():
                        text += f"\n--- Page {page_num + 1} ---\n{page_text}\n"
                except Exception as e:
                    logger.warning(f"Error extracting text from page {page_num + 1}: {str(e)}")
                    continue
        
        return text.strip()
    except Exception as e:
        logger.error(f"Error opening PDF file: {str(e)}")
        raise

# Mock storage for when Firebase is not available
class MockStorage:
    def __init__(self):
        self.documents = {}
    
    def store_document(self, filename: str, text: str, chunks: List[str]):
        doc_id = hashlib.md5(filename.encode()).hexdigest()
        self.documents[doc_id] = {
            'filename': filename,
            'text': text,
            'chunks': chunks,
            'timestamp': time.time()
        }
        logger.info(f"Document stored in mock storage: {filename}")
    
    def get_all_documents(self):
        return list(self.documents.values())
    
    def delete_all(self):
        self.documents.clear()
        logger.info("All documents deleted from mock storage")

# Initialize mock storage
mock_storage = MockStorage()

@app.get("/")
async def root():
    return {"message": "RAG Chatbot API is running", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "firebase_connected": db is not None,
        "components_loaded": True
    }

@app.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    components: dict = Depends(get_components)
):
    global vector_store
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    file_path = None
    try:
        logger.info(f"Processing file: {file.filename}")
        
        # Create uploads directory if it doesn't exist
        uploads_dir = Path("uploads")
        uploads_dir.mkdir(exist_ok=True)
        
        file_path = uploads_dir / file.filename
        
        # Write the uploaded file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Extract text asynchronously
        text = await extract_text_from_pdf(str(file_path))
        
        # Split text into chunks
        chunks = components["text_splitter"].split_text(text)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="No text chunks could be created from the PDF")

        # Store in Firebase or mock storage
        if db:
            try:
                doc_ref = db.collection('pdf_documents').document(file.filename)
                doc_ref.set({
                    'filename': file.filename,
                    'text': text,
                    'chunks': chunks,
                    'timestamp': firestore.SERVER_TIMESTAMP,
                    'chunk_count': len(chunks)
                })
                logger.info(f"Document stored in Firebase: {file.filename}")
            except Exception as e:
                logger.error(f"Firebase storage failed: {str(e)}")
                # Fallback to mock storage
                mock_storage.store_document(file.filename, text, chunks)
        else:
            mock_storage.store_document(file.filename, text, chunks)
        
        # Invalidate vector store cache
        vector_store = None
        document_cache.clear()
        
        return JSONResponse(content={
            "message": "PDF uploaded and processed successfully",
            "filename": file.filename,
            "chunks_created": len(chunks),
            "text_length": len(text)
        })

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")
    finally:
        # Clean up the uploaded file
        if file_path and file_path.exists():
            try:
                file_path.unlink()
            except Exception as e:
                logger.warning(f"Could not delete temporary file: {str(e)}")

@app.delete("/delete-all-data")
async def delete_all_data():
    global vector_store, document_cache
    
    try:
        if db:
            # Firebase deletion
            batch = db.batch()
            docs = db.collection('pdf_documents').limit(500).stream()
            
            deleted_count = 0
            for doc in docs:
                batch.delete(doc.reference)
                deleted_count += 1
            
            if deleted_count > 0:
                batch.commit()
                logger.info(f"Deleted {deleted_count} documents from Firebase")
        
        # Also clear mock storage
        mock_storage.delete_all()
        
        # Invalidate caches
        vector_store = None
        document_cache.clear()
        
        return JSONResponse(content={
            "message": "All data deleted successfully",
            "storage": "Firebase" if db else "Mock"
        })
        
    except Exception as e:
        logger.error(f"Error deleting data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting data: {str(e)}")

async def get_documents_from_storage(components: dict) -> List[Document]:
    try:
        # Check cache first
        cache_key = "all_documents"
        if cache_key in document_cache:
            cache_time, cached_docs = document_cache[cache_key]
            if time.time() - cache_time < 300:  # 5 minute cache
                return cached_docs

        loop = asyncio.get_event_loop()
        with concurrent.futures.ThreadPoolExecutor() as pool:
            documents = await loop.run_in_executor(pool, _get_documents_from_storage, components)
        
        # Cache the results
        document_cache[cache_key] = (time.time(), documents)
        return documents
        
    except Exception as e:
        logger.error(f"Error retrieving documents: {str(e)}")
        raise ValueError(f"Error retrieving documents: {str(e)}")

def _get_documents_from_storage(components: dict) -> List[Document]:
    documents = []
    
    try:
        if db:
            # Try Firebase first
            docs = db.collection('pdf_documents').stream()
            for doc in docs:
                doc_data = doc.to_dict()
                filename = doc_data.get('filename', 'Unknown')
                
                if 'chunks' in doc_data:
                    for i, chunk in enumerate(doc_data.get('chunks', [])):
                        if chunk.strip():  # Only add non-empty chunks
                            documents.append(Document(
                                page_content=chunk,
                                metadata={
                                    'source': filename,
                                    'chunk_id': i,
                                    'storage': 'firebase'
                                }
                            ))
                elif 'text' in doc_data:
                    # Fallback: split text if chunks not available
                    full_text = doc_data['text']
                    chunks = components["text_splitter"].split_text(full_text)
                    for i, chunk in enumerate(chunks):
                        if chunk.strip():
                            documents.append(Document(
                                page_content=chunk,
                                metadata={
                                    'source': filename,
                                    'chunk_id': i,
                                    'storage': 'firebase'
                                }
                            ))
        else:
            # Use mock storage
            for doc_data in mock_storage.get_all_documents():
                filename = doc_data.get('filename', 'Unknown')
                chunks = doc_data.get('chunks', [])
                
                for i, chunk in enumerate(chunks):
                    if chunk.strip():
                        documents.append(Document(
                            page_content=chunk,
                            metadata={
                                'source': filename,
                                'chunk_id': i,
                                'storage': 'mock'
                            }
                        ))
        
        logger.info(f"Retrieved {len(documents)} document chunks")
        return documents
        
    except Exception as e:
        logger.error(f"Error in _get_documents_from_storage: {str(e)}")
        return []

@app.get("/documents")
async def list_documents():
    """List all uploaded documents"""
    try:
        documents = []
        
        if db:
            docs = db.collection('pdf_documents').stream()
            for doc in docs:
                doc_data = doc.to_dict()
                documents.append({
                    'filename': doc_data.get('filename'),
                    'chunk_count': len(doc_data.get('chunks', [])),
                    'text_length': len(doc_data.get('text', '')),
                    'storage': 'firebase'
                })
        else:
            for doc_data in mock_storage.get_all_documents():
                documents.append({
                    'filename': doc_data.get('filename'),
                    'chunk_count': len(doc_data.get('chunks', [])),
                    'text_length': len(doc_data.get('text', '')),
                    'storage': 'mock'
                })
        
        return JSONResponse(content={
            "documents": documents,
            "total": len(documents)
        })
        
    except Exception as e:
        logger.error(f"Error listing documents: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(
    query: str = Form(...),
    components: dict = Depends(get_components)
):
    global vector_store
    
    if not query or query.strip() == "":
        raise HTTPException(status_code=400, detail="Query cannot be empty")
    
    try:
        # Get or create vector store
        if vector_store is None:
            documents = await get_documents_from_storage(components)
            
            if not documents:
                return JSONResponse(
                    content={
                        "response": "No documents have been uploaded yet. Please upload a PDF document first.",
                        "source_documents": []
                    },
                    status_code=200
                )
            
            # Create vector store in a separate thread
            loop = asyncio.get_event_loop()
            with concurrent.futures.ThreadPoolExecutor() as pool:
                vector_store = await loop.run_in_executor(
                    pool,
                    lambda: FAISS.from_documents(documents, components["embedding_fn"])
                )
            
            logger.info(f"Vector store created with {len(documents)} documents")
        
        # Enhanced retrieval with more relevant documents
        retriever = vector_store.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 5}  # Retrieve top 5 most relevant chunks
        )
        
        # Create enhanced QA chain with custom prompt
        qa_prompt = get_qa_prompt()
        
        chain = RetrievalQA.from_chain_type(
            llm=get_gemini_llm(),
            chain_type="stuff",
            retriever=retriever,
            chain_type_kwargs={"prompt": qa_prompt},
            return_source_documents=True
        )

        # Run query in a separate thread
        loop = asyncio.get_event_loop()
        with concurrent.futures.ThreadPoolExecutor() as pool:
            result = await loop.run_in_executor(
                pool,
                lambda: chain({"query": query})
            )
        
        # Format source documents for response
        source_docs = []
        if "source_documents" in result:
            for doc in result["source_documents"]:
                source_docs.append({
                    "content": doc.page_content[:200] + "...",  # Truncate for readability
                    "metadata": doc.metadata
                })
        
        response_data = {
            "response": result["result"],
            "source_documents": source_docs,
            "query": query
        }
        
        logger.info(f"Query processed successfully: {query[:50]}...")
        return JSONResponse(content=response_data)

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return JSONResponse(
            content={
                "error": f"An error occurred while processing your query: {str(e)}",
                "response": "I apologize, but I encountered an error while processing your question. Please try again."
            },
            status_code=500
        )

@app.post("/similarity-search")
async def similarity_search(
    query: str = Form(...),
    k: int = Form(default=3),
    components: dict = Depends(get_components)
):
    """Perform similarity search without LLM generation"""
    global vector_store
    
    try:
        if vector_store is None:
            documents = await get_documents_from_storage(components)
            if not documents:
                return JSONResponse(content={"error": "No documents available"}, status_code=404)
            
            loop = asyncio.get_event_loop()
            with concurrent.futures.ThreadPoolExecutor() as pool:
                vector_store = await loop.run_in_executor(
                    pool,
                    lambda: FAISS.from_documents(documents, components["embedding_fn"])
                )
        
        # Perform similarity search
        docs = vector_store.similarity_search(query, k=k)
        
        results = []
        for doc in docs:
            results.append({
                "content": doc.page_content,
                "metadata": doc.metadata
            })
        
        return JSONResponse(content={
            "query": query,
            "results": results,
            "count": len(results)
        })
        
    except Exception as e:
        logger.error(f"Error in similarity search: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=8001, 
        reload=True,
        log_level="info"
    )