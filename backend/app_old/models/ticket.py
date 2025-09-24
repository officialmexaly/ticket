from sqlalchemy import Column, Integer, String, Text, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from app.core.database import Base


class TicketPriority(str, enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class TicketType(str, enum.Enum):
    QUESTION = "Question"
    INCIDENT = "Incident"
    PROBLEM = "Problem"
    FEATURE_REQUEST = "Feature Request"
    UNSPECIFIED = "Unspecified"


class TicketStatus(str, enum.Enum):
    OPEN = "Open"
    IN_PROGRESS = "In Progress"
    PENDING = "Pending"
    RESOLVED = "Resolved"
    CLOSED = "Closed"


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(Enum(TicketPriority), default=TicketPriority.MEDIUM)
    type = Column(Enum(TicketType), default=TicketType.QUESTION)
    status = Column(Enum(TicketStatus), default=TicketStatus.OPEN)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship to voice notes
    voice_notes = relationship("VoiceNote", back_populates="ticket", cascade="all, delete-orphan")