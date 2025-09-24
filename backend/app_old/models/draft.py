from sqlalchemy import Column, Integer, String, Text, DateTime, Enum, JSON
from sqlalchemy.sql import func

from app.core.database import Base
from app.models.ticket import TicketPriority, TicketType, TicketStatus


class Draft(Base):
    __tablename__ = "drafts"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM)
    type = Column(Enum(TicketType), default=TicketType.QUESTION)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN)
    voice_notes = Column(JSON, default=list)  # Store voice notes as JSON
    saved_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())