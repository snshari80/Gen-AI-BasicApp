from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
import os

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.environ['OPENAI_API_KEY'] =  os.getenv("OPENAI_API_KEY")

llm = ChatOpenAI(
    model='gpt-3.5-turbo',
    temperature=0.7
)

prompt = ChatPromptTemplate.from_template(    """
You are an AI {mode} assistant.

Modes:
- "chat" → Answer normally in plain English
- "code" → Fix code and explain
- "code" → Explain code
- "code" → Generate code

If the input is normal English (not code), DO NOT generate code.
Respond like a human assistant.

User Input:
{code}
       """)

class CodeRequest(BaseModel):
    code: str
    mode:str


@app.post("/query")
def fix_code(req:CodeRequest):
    chain = prompt | llm
    result = chain.invoke({"code":req.code, "mode": req.mode })
    return {"response" : result.content}

@app.get("/health")
def read_app():
    return { "Message" : "AI-backend is running"}