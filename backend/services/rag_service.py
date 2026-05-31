import os
from langchain_community.document_loaders import ( PyMuPDFLoader, Docx2txtLoader )
from utils.utils import text_splitter
from services.vector_service import embeddings_vector
from services.image_embedding_service import image_embedding
from pathlib import Path

UPLOAD_PATH = "uploads_cache"

if not os.path.exists(UPLOAD_PATH):
    os.makedirs(UPLOAD_PATH, exist_ok=True)

async def process_upload(file):
    if UPLOAD_PATH:
        file_path = os.path.join(UPLOAD_PATH, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        result = await filechunk_embeddings(file,file_path)
        return result

async def filechunk_embeddings(file, file_path):
    all_documents = []
    ext = Path(file_path).suffix.lower().lstrip(".")
    if ext == "pdf":
        loader = PyMuPDFLoader(file_path)
    elif ext == "docx":
        loader = Docx2txtLoader(file_path)
    else:
        return {"error": "Unsupported file type"}
    
    docs = loader.load()
    for doc in docs:
        doc.metadata['source_type'] = ext
        doc.metadata['file_name'] = file.filename

    
    all_documents.append(docs)

    # image_docs = await image_embedding(file_path)

    # if image_docs:
    #     all_documents.extend(image_docs)

    split_docs = await text_splitter(docs)

    result = await embeddings_vector(split_docs)
    return result
