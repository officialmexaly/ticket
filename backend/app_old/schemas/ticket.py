from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

from app.models.ticket import TicketPriority, TicketType, TicketStatus


class VoiceNoteBase(BaseModel):
    id: int
    filename: str
    original_name: str
    duration: int
    size: int
    timestamp: str

    class Config:
        from_attributes = True


class TicketBase(BaseModel):
    subject: str
    description: str
    priority: TicketPriority = TicketPriority.MEDIUM
    type: TicketType = TicketType.QUESTION
    status: TicketStatus = TicketStatus.OPEN


class TicketCreate(TicketBase):
    voice_notes: Optional[List[VoiceNoteBase]] = []


class TicketUpdate(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TicketPriority] = None
    type: Optional[TicketType] = None
    status: Optional[TicketStatus] = None
    voice_notes: Optional[List[VoiceNoteBase]] = None


class TicketResponse(TicketBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    voice_notes: List[VoiceNoteBase] = []

    class Config:
        from_attributes = True