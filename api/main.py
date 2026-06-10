from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class VerifyRequest(BaseModel):
    code: str

@app.get("/")
def read_root():
    return {"message": "API is running"}

@app.post("/api/auth/verify")
def verify(req: VerifyRequest):
    return {"success": req.code == "123456"}

