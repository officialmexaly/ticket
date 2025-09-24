from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

from app.models.ticket import TicketPriority, TicketType, TicketStatus


class VoiceNoteInfo(BaseModel):
    id: int
    filename: str
    original_name: str
    duration: int
    size: int
    timestamp: str


class DraftBase(BaseModel):
    subject: Optional[str] = None
    description: Optional[str] = None
    priority: TicketPriority = TicketPriority.MEDIUM
    type: TicketType = TicketType.QUESTION
    status: TicketStatus = TicketStatus.OPEN


class DraftCreate(DraftBase):
    voice_notes: Optional[List[VoiceNoteInfo]] = []


class DraftUpdate(DraftBase):
    voice_notes: Optional[List[VoiceNoteInfo]] = None


class DraftResponse(DraftBase):
    id: int
    saved_at: datetime
    voice_notes: List[VoiceNoteInfo] = []

    class Config:
        from_attributes = True