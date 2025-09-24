from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.core.config import settings
from app.core.database import engine
from app.models import Base
from app.api import tickets, drafts, voice_notes

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory and mount static files
upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(exist_ok=True)
app.mount("/voice-notes", StaticFiles(directory=settings.UPLOAD_DIR), name="voice-notes")

# Include API routes
app.include_router(tickets.router, prefix=f"{settings.API_V1_STR}/tickets", tags=["tickets"])
app.include_router(drafts.router, prefix=f"{settings.API_V1_STR}/drafts", tags=["drafts"])
app.include_router(voice_notes.router, prefix=f"{settings.API_V1_STR}/voice-notes", tags=["voice-notes"])


@app.get("/")
async def root():
    return {"message": "Ticket System API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}