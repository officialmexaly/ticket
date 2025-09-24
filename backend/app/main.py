from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
import os
import aiofiles
import uuid
from typing import Optional, List
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./tickets.db")

# File upload settings
UPLOAD_DIR = "uploads"
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_AUDIO_TYPES = ["audio/wav", "audio/mp3", "audio/m4a", "audio/ogg", "audio/webm"]

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Database setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI app
app = FastAPI(
    title="Ticket System API",
    description="A comprehensive ticket management system with voice notes and drafts - No Authentication Required",
    version="2.2.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True, nullable=False, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)  # Make nullable since we're not using authentication
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    tickets = relationship("Ticket", back_populates="creator")
    drafts = relationship("Draft", back_populates="user")

class Ticket(Base):
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True, nullable=False, default=lambda: str(uuid.uuid4()))
    subject = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="Open")
    priority = Column(String, default="Medium")
    type = Column(String, default="Question")
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    creator = relationship("User", back_populates="tickets")
    voice_notes = relationship("VoiceNote", back_populates="ticket", cascade="all, delete-orphan")

class VoiceNote(Base):
    __tablename__ = "voice_notes"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True, nullable=False, default=lambda: str(uuid.uuid4()))
    filename = Column(String, nullable=False)
    original_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    duration = Column(Integer, default=0)  # Duration in seconds
    size = Column(Integer, default=0)  # File size in bytes
    content_type = Column(String, nullable=False)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=True)
    draft_id = Column(Integer, ForeignKey("drafts.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    ticket = relationship("Ticket", back_populates="voice_notes")
    draft = relationship("Draft", back_populates="voice_notes")

class Draft(Base):
    __tablename__ = "drafts"
    
    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True, nullable=False, default=lambda: str(uuid.uuid4()))
    subject = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    priority = Column(String, default="Medium")
    type = Column(String, default="Question")
    status = Column(String, default="Open")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="drafts")
    voice_notes = relationship("VoiceNote", back_populates="draft", cascade="all, delete-orphan")

# Create tables only if they don't exist (preserve existing data)
Base.metadata.create_all(bind=engine)

# Create default user if none exists
def ensure_default_user():
    db = SessionLocal()
    try:
        user = db.query(User).first()
        if not user:
            default_user = User(
                uuid=str(uuid.uuid4()),
                email="admin@example.com",
                username="admin",
                is_active=True
            )
            db.add(default_user)
            db.commit()
            db.refresh(default_user)
            return default_user
        return user
    finally:
        db.close()

# Pydantic Models
class VoiceNoteResponse(BaseModel):
    id: int
    uuid: str
    filename: str
    original_name: str
    url: str
    duration: int
    size: int
    timestamp: str

    class Config:
        from_attributes = True

class VoiceNoteCreate(BaseModel):
    id: int
    filename: str
    original_name: str
    duration: int
    size: int
    timestamp: str

class TicketCreate(BaseModel):
    subject: str
    description: str
    priority: str = "Medium"
    type: str = "Question"
    status: str = "Open"
    voice_notes: List[VoiceNoteCreate] = []

class TicketUpdate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    voice_notes: List[VoiceNoteCreate] = []

class TicketResponse(BaseModel):
    id: int
    uuid: str
    subject: str
    description: str = None
    status: str
    priority: str
    type: str
    created_by: int
    created_at: datetime
    updated_at: datetime
    voice_notes: List[VoiceNoteResponse] = []

    class Config:
        from_attributes = True

class DraftCreate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    priority: str = "Medium"
    type: str = "Question"
    status: str = "Open"
    voice_notes: List[VoiceNoteCreate] = []

class DraftResponse(BaseModel):
    id: int
    uuid: str
    subject: Optional[str]
    description: Optional[str]
    priority: str
    type: str
    status: str
    saved_at: datetime
    voice_notes: List[VoiceNoteResponse] = []

    class Config:
        from_attributes = True

class UploadResponse(BaseModel):
    filename: str
    original_name: str
    url: str
    size: int

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Get default user for all operations
def get_default_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(
            uuid=str(uuid.uuid4()),
            email="admin@example.com",
            username="admin",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def format_voice_note_response(voice_note: VoiceNote) -> VoiceNoteResponse:
    return VoiceNoteResponse(
        id=voice_note.id,
        uuid=voice_note.uuid,
        filename=voice_note.filename,
        original_name=voice_note.original_name,
        url=f"/uploads/{voice_note.filename}",
        duration=voice_note.duration,
        size=voice_note.size,
        timestamp=voice_note.created_at.strftime("%Y-%m-%d %H:%M:%S")
    )

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to the Ticket System API v2.2 - No Authentication Required - Now with UUID support"}

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    # Check database connection and get some stats
    try:
        ticket_count = db.query(Ticket).count()
        draft_count = db.query(Draft).count()
        voice_note_count = db.query(VoiceNote).count()
        return {
            "status": "healthy", 
            "timestamp": datetime.utcnow(),
            "database": {
                "tickets": ticket_count,
                "drafts": draft_count,
                "voice_notes": voice_note_count
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.utcnow(),
            "error": str(e)
        }

# Voice Note Routes
@app.post("/voice-notes/upload", response_model=UploadResponse)
async def upload_voice_note(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ALLOWED_AUDIO_TYPES:
        raise HTTPException(
            status_code=400, 
            detail=f"File type {file.content_type} not allowed. Allowed types: {ALLOWED_AUDIO_TYPES}"
        )
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ".wav"
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Read and validate file size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File size exceeds maximum allowed size of {MAX_FILE_SIZE} bytes"
        )
    
    # Save file
    async with aiofiles.open(file_path, 'wb') as f:
        await f.write(contents)
    
    return UploadResponse(
        filename=unique_filename,
        original_name=file.filename or "voice-note",
        url=f"/uploads/{unique_filename}",
        size=len(contents)
    )

@app.delete("/voice-notes/{filename}")
async def delete_voice_note(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return {"message": "Voice note deleted successfully"}
        except OSError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error deleting file: {str(e)}"
            )
    else:
        raise HTTPException(
            status_code=404,
            detail="Voice note not found"
        )

# Draft Routes
@app.post("/drafts/", response_model=DraftResponse)
def save_draft(
    draft_data: DraftCreate, 
    current_user: User = Depends(get_default_user), 
    db: Session = Depends(get_db)
):
    # Delete existing draft for this user (only one draft per user)
    existing_draft = db.query(Draft).filter(Draft.user_id == current_user.id).first()
    if existing_draft:
        db.delete(existing_draft)
        db.commit()
    
    # Create new draft
    db_draft = Draft(
        uuid=str(uuid.uuid4()),
        subject=draft_data.subject,
        description=draft_data.description,
        priority=draft_data.priority,
        type=draft_data.type,
        status=draft_data.status,
        user_id=current_user.id
    )
    db.add(db_draft)
    db.commit()
    db.refresh(db_draft)
    
    # Add voice notes to draft
    for voice_note_data in draft_data.voice_notes:
        db_voice_note = VoiceNote(
            uuid=str(uuid.uuid4()),
            filename=voice_note_data.filename,
            original_name=voice_note_data.original_name,
            file_path=os.path.join(UPLOAD_DIR, voice_note_data.filename),
            duration=voice_note_data.duration,
            size=voice_note_data.size,
            content_type="audio/wav",  # Default, should be determined from file
            draft_id=db_draft.id
        )
        db.add(db_voice_note)
    
    db.commit()
    db.refresh(db_draft)
    
    # Format response
    voice_notes_response = [format_voice_note_response(vn) for vn in db_draft.voice_notes]
    
    return DraftResponse(
        id=db_draft.id,
        uuid=db_draft.uuid,
        subject=db_draft.subject,
        description=db_draft.description,
        priority=db_draft.priority,
        type=db_draft.type,
        status=db_draft.status,
        saved_at=db_draft.saved_at,
        voice_notes=voice_notes_response
    )

@app.get("/drafts/")
def get_draft(current_user: User = Depends(get_default_user), db: Session = Depends(get_db)):
    # Get the most recent draft for the user
    draft = db.query(Draft).filter(Draft.user_id == current_user.id).order_by(Draft.saved_at.desc()).first()
    if not draft:
        return None
    
    # Sort voice notes by creation time (newest first)
    voice_notes_response = [format_voice_note_response(vn) for vn in 
                           sorted(draft.voice_notes, key=lambda x: x.created_at, reverse=True)]
    
    return DraftResponse(
        id=draft.id,
        uuid=draft.uuid,
        subject=draft.subject,
        description=draft.description,
        priority=draft.priority,
        type=draft.type,
        status=draft.status,
        saved_at=draft.saved_at,
        voice_notes=voice_notes_response
    )

@app.delete("/drafts/")
def delete_draft(current_user: User = Depends(get_default_user), db: Session = Depends(get_db)):
    draft = db.query(Draft).filter(Draft.user_id == current_user.id).first()
    if draft:
        db.delete(draft)
        db.commit()
        return {"message": "Draft deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Draft not found")

# Ticket Routes
@app.post("/tickets/", response_model=TicketResponse)
def create_ticket(
    ticket: TicketCreate, 
    current_user: User = Depends(get_default_user), 
    db: Session = Depends(get_db)
):
    db_ticket = Ticket(
        uuid=str(uuid.uuid4()),
        subject=ticket.subject,
        description=ticket.description,
        priority=ticket.priority,
        type=ticket.type,
        status=ticket.status,
        created_by=current_user.id
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    # Add voice notes to ticket
    for voice_note_data in ticket.voice_notes:
        db_voice_note = VoiceNote(
            uuid=str(uuid.uuid4()),
            filename=voice_note_data.filename,
            original_name=voice_note_data.original_name,
            file_path=os.path.join(UPLOAD_DIR, voice_note_data.filename),
            duration=voice_note_data.duration,
            size=voice_note_data.size,
            content_type="audio/wav",  # Default, should be determined from file
            ticket_id=db_ticket.id
        )
        db.add(db_voice_note)
    
    db.commit()
    db.refresh(db_ticket)
    
    # Format response
    voice_notes_response = [format_voice_note_response(vn) for vn in db_ticket.voice_notes]
    
    return TicketResponse(
        id=db_ticket.id,
        uuid=db_ticket.uuid,
        subject=db_ticket.subject,
        description=db_ticket.description,
        status=db_ticket.status,
        priority=db_ticket.priority,
        type=db_ticket.type,
        created_by=db_ticket.created_by,
        created_at=db_ticket.created_at,
        updated_at=db_ticket.updated_at,
        voice_notes=voice_notes_response
    )

@app.get("/tickets/")
def get_tickets(
    skip: int = 0, 
    limit: int = 100, 
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db)
):
    # Build the query with sorting
    query = db.query(Ticket)
    
    # Apply sorting
    if sort_order.lower() == "desc":
        if sort_by == "created_at":
            query = query.order_by(Ticket.created_at.desc())
        elif sort_by == "updated_at":
            query = query.order_by(Ticket.updated_at.desc())
        elif sort_by == "subject":
            query = query.order_by(Ticket.subject.desc())
        elif sort_by == "status":
            query = query.order_by(Ticket.status.desc())
        elif sort_by == "priority":
            query = query.order_by(Ticket.priority.desc())
        else:
            query = query.order_by(Ticket.created_at.desc())
    else:
        if sort_by == "created_at":
            query = query.order_by(Ticket.created_at.asc())
        elif sort_by == "updated_at":
            query = query.order_by(Ticket.updated_at.asc())
        elif sort_by == "subject":
            query = query.order_by(Ticket.subject.asc())
        elif sort_by == "status":
            query = query.order_by(Ticket.status.asc())
        elif sort_by == "priority":
            query = query.order_by(Ticket.priority.asc())
        else:
            query = query.order_by(Ticket.created_at.asc())
    
    tickets = query.offset(skip).limit(limit).all()
    
    tickets_response = []
    for ticket in tickets:
        # Sort voice notes by creation time (newest first)
        voice_notes_response = [format_voice_note_response(vn) for vn in 
                               sorted(ticket.voice_notes, key=lambda x: x.created_at, reverse=True)]
        tickets_response.append(TicketResponse(
            id=ticket.id,
            uuid=ticket.uuid,
            subject=ticket.subject,
            description=ticket.description,
            status=ticket.status,
            priority=ticket.priority,
            type=ticket.type,
            created_by=ticket.created_by,
            created_at=ticket.created_at,
            updated_at=ticket.updated_at,
            voice_notes=voice_notes_response
        ))
    
    return tickets_response

@app.get("/tickets/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int, 
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Sort voice notes by creation time (newest first)
    voice_notes_response = [format_voice_note_response(vn) for vn in 
                           sorted(ticket.voice_notes, key=lambda x: x.created_at, reverse=True)]
    
    return TicketResponse(
        id=ticket.id,
        uuid=ticket.uuid,
        subject=ticket.subject,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        type=ticket.type,
        created_by=ticket.created_by,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
        voice_notes=voice_notes_response
    )

# New route to get ticket by UUID
@app.get("/tickets/uuid/{ticket_uuid}", response_model=TicketResponse)
def get_ticket_by_uuid(
    ticket_uuid: str, 
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.uuid == ticket_uuid).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Sort voice notes by creation time (newest first)
    voice_notes_response = [format_voice_note_response(vn) for vn in 
                           sorted(ticket.voice_notes, key=lambda x: x.created_at, reverse=True)]
    
    return TicketResponse(
        id=ticket.id,
        uuid=ticket.uuid,
        subject=ticket.subject,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        type=ticket.type,
        created_by=ticket.created_by,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
        voice_notes=voice_notes_response
    )

@app.put("/tickets/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Update ticket fields
    if ticket_update.subject is not None:
        ticket.subject = ticket_update.subject
    if ticket_update.description is not None:
        ticket.description = ticket_update.description
    if ticket_update.priority is not None:
        ticket.priority = ticket_update.priority
    if ticket_update.type is not None:
        ticket.type = ticket_update.type
    if ticket_update.status is not None:
        ticket.status = ticket_update.status
    
    ticket.updated_at = datetime.utcnow()
    
    # Handle voice notes update (simple approach: replace all)
    if ticket_update.voice_notes:
        # Delete existing voice notes
        for vn in ticket.voice_notes:
            db.delete(vn)
        
        # Add new voice notes
        for voice_note_data in ticket_update.voice_notes:
            db_voice_note = VoiceNote(
                uuid=str(uuid.uuid4()),
                filename=voice_note_data.filename,
                original_name=voice_note_data.original_name,
                file_path=os.path.join(UPLOAD_DIR, voice_note_data.filename),
                duration=voice_note_data.duration,
                size=voice_note_data.size,
                content_type="audio/wav",
                ticket_id=ticket.id
            )
            db.add(db_voice_note)
    
    db.commit()
    db.refresh(ticket)
    
    voice_notes_response = [format_voice_note_response(vn) for vn in ticket.voice_notes]
    
    return TicketResponse(
        id=ticket.id,
        uuid=ticket.uuid,
        subject=ticket.subject,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        type=ticket.type,
        created_by=ticket.created_by,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
        voice_notes=voice_notes_response
    )

# New route to update ticket by UUID
@app.put("/tickets/uuid/{ticket_uuid}", response_model=TicketResponse)
def update_ticket_by_uuid(
    ticket_uuid: str,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.uuid == ticket_uuid).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Update ticket fields
    if ticket_update.subject is not None:
        ticket.subject = ticket_update.subject
    if ticket_update.description is not None:
        ticket.description = ticket_update.description
    if ticket_update.priority is not None:
        ticket.priority = ticket_update.priority
    if ticket_update.type is not None:
        ticket.type = ticket_update.type
    if ticket_update.status is not None:
        ticket.status = ticket_update.status
    
    ticket.updated_at = datetime.utcnow()
    
    # Handle voice notes update (simple approach: replace all)
    if ticket_update.voice_notes:
        # Delete existing voice notes
        for vn in ticket.voice_notes:
            db.delete(vn)
        
        # Add new voice notes
        for voice_note_data in ticket_update.voice_notes:
            db_voice_note = VoiceNote(
                uuid=str(uuid.uuid4()),
                filename=voice_note_data.filename,
                original_name=voice_note_data.original_name,
                file_path=os.path.join(UPLOAD_DIR, voice_note_data.filename),
                duration=voice_note_data.duration,
                size=voice_note_data.size,
                content_type="audio/wav",
                ticket_id=ticket.id
            )
            db.add(db_voice_note)
    
    db.commit()
    db.refresh(ticket)
    
    voice_notes_response = [format_voice_note_response(vn) for vn in ticket.voice_notes]
    
    return TicketResponse(
        id=ticket.id,
        uuid=ticket.uuid,
        subject=ticket.subject,
        description=ticket.description,
        status=ticket.status,
        priority=ticket.priority,
        type=ticket.type,
        created_by=ticket.created_by,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
        voice_notes=voice_notes_response
    )

@app.put("/tickets/{ticket_id}/status")
def update_ticket_status(
    ticket_id: int, 
    status: str, 
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.status = status
    ticket.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Ticket status updated successfully"}

# New route to update ticket status by UUID
@app.put("/tickets/uuid/{ticket_uuid}/status")
def update_ticket_status_by_uuid(
    ticket_uuid: str, 
    status: str, 
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.uuid == ticket_uuid).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    ticket.status = status
    ticket.updated_at = datetime.utcnow()
    db.commit()
    return {"message": "Ticket status updated successfully"}

@app.delete("/tickets/{ticket_id}")
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    db.delete(ticket)
    db.commit()
    return {"message": "Ticket deleted successfully"}

# New route to delete ticket by UUID
@app.delete("/tickets/uuid/{ticket_uuid}")
def delete_ticket_by_uuid(
    ticket_uuid: str,
    db: Session = Depends(get_db)
):
    ticket = db.query(Ticket).filter(Ticket.uuid == ticket_uuid).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    db.delete(ticket)
    db.commit()
    return {"message": "Ticket deleted successfully"}

# Initialize default user on startup
@app.on_event("startup")
def startup_event():
    ensure_default_user()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)