import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .stool_service import router


app = FastAPI()

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in cors_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.exception_handler(RequestValidationError)
async def request_validation_error_handler(_: Request, exc: RequestValidationError):
    first_error = exc.errors()[0].get("msg", "invalid request") if exc.errors() else "invalid request"
    return JSONResponse(
        status_code=422,
        content={"message": f"validation error: {first_error}"},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    message = exc.detail if isinstance(exc.detail, str) else "request failed"
    return JSONResponse(
        status_code=exc.status_code,
        content={"message": f"validation error: {message}"},
    )
