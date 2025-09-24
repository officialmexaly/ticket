from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.core.database import Base


class VoiceNote(Base):
    __tablename__ = "voice_notes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    original_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    size = Column(Integer, nullable=False)
    duration = Column(Integer, default=0)  # Duration in seconds
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Foreign key to ticket (optional, for standalone voice notes)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=True)

    # Relationship
    ticket = relationship("Ticket", back_populates="voice_notes")