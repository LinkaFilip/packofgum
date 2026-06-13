import hmac
import os
import time
from typing import Dict

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()
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

MAX_ATTEMPTS = int(os.getenv("MAX_ATTEMPTS", "5"))
BLOCK_WINDOW_SECONDS = int(os.getenv("BLOCK_WINDOW_SECONDS", str(15 * 60)))

FAILED_ATTEMPTS: Dict[str, Dict[str, float]] = {}
VERIFICATION_CODE = os.getenv("AUTH_CODE")

if not VERIFICATION_CODE:
    raise RuntimeError(
        "Environment variable AUTH_CODE must be set to a secret verification code."
    )

class VerifyRequest(BaseModel):
    code: str


def _get_client_key(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    client = request.client
    return client.host if client else "unknown"


@app.get("/")
def read_root():
    return {"message": "API is running"}


@app.post("/api/auth/verify")
def verify(data: VerifyRequest, request: Request):
    client_key = _get_client_key(request)
    now = time.time()
    state = FAILED_ATTEMPTS.setdefault(client_key, {"count": 0.0, "blocked_until": 0.0})

    if state["blocked_until"] > now:
        raise HTTPException(
            status_code=429,
            detail="Too many failed attempts. Try again later."
        )

    is_valid = hmac.compare_digest(data.code, VERIFICATION_CODE)
    if not is_valid:
        state["count"] += 1
        if state["count"] >= MAX_ATTEMPTS:
            state["blocked_until"] = now + BLOCK_WINDOW_SECONDS
            state["count"] = 0.0
            raise HTTPException(
                status_code=429,
                detail="Too many failed attempts. Try again in 15 minutes."
            )

        raise HTTPException(
            status_code=401,
            detail="Invalid code"
        )

    FAILED_ATTEMPTS.pop(client_key, None)
    return {"success": True}
