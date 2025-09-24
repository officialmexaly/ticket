from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class VoiceNoteBase(BaseModel):
    filename: str
    original_name: str
    size: int
    duration: Optional[int] = 0


class VoiceNoteCreate(VoiceNoteBase):
    file_path: str


class VoiceNoteResponse(VoiceNoteBase):
    id: int
    file_path: str
    url: str
    created_at: datetime
    ticket_id: Optional[int] = None

    class Config:
        from_attributes = True