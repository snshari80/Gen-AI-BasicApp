import os
from langchain_community.vectorstores import FAISS
from services.llm_service import embeddings_model

FAISS_INDEX_PATH = "faiss_index"

if not os.path.exists(FAISS_INDEX_PATH):
    os.makedirs(FAISS_INDEX_PATH, exist_ok=True)

async def embeddings_vector(docs):
    try:
        if os.path.exists(os.path.join(FAISS_INDEX_PATH, "index.faiss")):
            vectorstore = FAISS.load_local(
                FAISS_INDEX_PATH,
                embeddings_model,
                allow_dangerous_deserialization=True
            )
            vectorstore.add_documents(docs)
        else:
            vectorstore = FAISS.from_documents(
                documents=docs,
                embedding=embeddings_model,
                metadata={"source": "file1.pdf"}
            )

        vectorstore.save_local(str(FAISS_INDEX_PATH))

        file_name = docs[0].metadata["file_name"]

        return {
            'file_name': file_name,
            "message": "File uploaded successfully & added to vector db",
        }
    
    except Exception as e:

        return {
            "error": str(e),
            "message": "Failed to process document"
        }


def get_vectorstore():
    if os.path.exists(FAISS_INDEX_PATH):
        try:
            vectorstore = FAISS.load_local(
                FAISS_INDEX_PATH,
                embeddings_model,
                allow_dangerous_deserialization=True
            )
            return vectorstore
        except Exception as e:
            print(f"Error loading vectorstore: {e}")
            return None
    return None