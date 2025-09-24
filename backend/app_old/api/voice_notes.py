from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from pathlib import Path

from app.core.database import get_db
from app.core.config import settings
from app.models.voice_note import VoiceNote
from app.schemas.voice_note import VoiceNoteResponse

router = APIRouter()

# Ensure upload directory exists
upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(exist_ok=True)


@router.post("/upload")
async def upload_voice_note(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload a voice note file"""
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected")

    # Check file size
    if file.size and file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large")

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = upload_dir / unique_filename

    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")

    # Create database record
    voice_note = VoiceNote(
        filename=unique_filename,
        original_name=file.filename,
        file_path=str(file_path),
        size=file.size or 0
    )

    db.add(voice_note)
    db.commit()
    db.refresh(voice_note)

    return {
        "filename": voice_note.filename,
        "original_name": voice_note.original_name,
        "url": f"/voice-notes/{voice_note.filename}",
        "size": voice_note.size
    }


@router.get("/{filename}")
async def get_voice_note(filename: str):
    """Serve a voice note file"""
    file_path = upload_dir / filename
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    from fastapi.responses import FileResponse
    return FileResponse(file_path)


@router.delete("/{filename}")
def delete_voice_note(filename: str, db: Session = Depends(get_db)):
    """Delete a voice note file and database record"""
    voice_note = db.query(VoiceNote).filter(VoiceNote.filename == filename).first()
    if not voice_note:
        raise HTTPException(status_code=404, detail="Voice note not found")

    # Delete file from filesystem
    file_path = Path(voice_note.file_path)
    if file_path.exists():
        file_path.unlink()

    # Delete database record
    db.delete(voice_note)
    db.commit()

    return {"message": "Voice note deleted successfully"}