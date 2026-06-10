from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class VerifyRequest(BaseModel):
    code: str

@app.post("/api/auth/verify")
def verify(req: VerifyRequest):
    return {
        "success": req.code == "123456"
    }

