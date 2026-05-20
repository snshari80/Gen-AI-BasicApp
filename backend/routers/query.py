from fastapi import APIRouter
from pydantic import BaseModel
from langchain_classic.memory import ConversationBufferMemory
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_core.prompts import PromptTemplate
from services.llm_service import llm
from services.vector_service import get_vectorstore

router = APIRouter()

class QueryRequest(BaseModel):
    question: str

class QueryResponse(BaseModel):
    question: str
    answer: str
    sources: list

@router.post("/query", response_model=QueryResponse)
async def query_documents(req: QueryRequest):

    vectorstore = get_vectorstore()
    
    if vectorstore is None:
        return {
            "question": req.question,
            "answer": "No documents uploaded yet. Please upload documents first.",
            "sources": []
        }
    
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True,
        output_key="answer"
    )
    
    prompt_template = PromptTemplate(
        input_variables=["context", "question", "chat_history"],
        template="""Use the following pieces of context to answer the user's question. 
                    If you cannot find the answer in the context, say so clearly.

                    Context:
                    {context}

                    Chat History:
                    {chat_history}

                    User Question: {question}
                    Answer:""")

    chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        return_source_documents=True,
        combine_docs_chain_kwargs={"prompt": prompt_template}
    )
    
    result = chain.invoke({
        "question": req.question,
        "chat_history": []
    })

    seen_sources = set()
    sources = []

    for doc in result.get("source_documents", []):
        fname = doc.metadata.get("file_name", "unknown")

        if fname and fname not in seen_sources:
            seen_sources.add(fname)
            sources.append(f"📄 {fname}")

    answer = result.get("answer", "")

    if sources:
        answer += "\n\n---\n**📚 Sources:**\n" + "\n".join(sources)

    return {
        "question": req.question,
        "answer": answer,
        "sources": sources
    }