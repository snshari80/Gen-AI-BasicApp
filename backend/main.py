from dotenv import load_dotenv
import os

load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError('Please set the OPENAI_API_KEY')

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import query, upload

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

# include routers
app.include_router(query.router)
app.include_router(upload.router)


@app.get("/health")
def read_app():
    return {"Message": "AI-backend is running"}

