from fastapi import FastAPI

app = FastAPI()

Port = 8000

@app.get("/health")
def health_check()->dict:
    return {
        "Status": "AI Backend is running",
        "Port": Port
    }