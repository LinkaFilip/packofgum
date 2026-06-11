from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://packofgum.netlify.app",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class VerifyRequest(BaseModel):
    code: str

@app.get("/")
def read_root():
    return {"message": "API is running"}

@app.post("/api/auth/verify")
def verify(data: VerifyRequest):
    if data.code != "123456":
        raise HTTPException(
            status_code=401,
            detail="Invalid code"
        )

    return {"success": True}
