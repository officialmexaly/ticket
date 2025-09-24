from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.draft import Draft
from app.schemas.draft import DraftCreate, DraftUpdate, DraftResponse

router = APIRouter()


@router.post("/", response_model=DraftResponse)
def save_draft(draft: DraftCreate, db: Session = Depends(get_db)):
    """Save or update a draft (we only keep one draft at a time)"""
    # Delete existing draft first
    db.query(Draft).delete()

    # Create new draft
    db_draft = Draft(
        subject=draft.subject,
        description=draft.description,
        priority=draft.priority,
        type=draft.type,
        status=draft.status,
        voice_notes=[note.dict() for note in draft.voice_notes] if draft.voice_notes else []
    )

    db.add(db_draft)
    db.commit()
    db.refresh(db_draft)

    return db_draft


@router.get("/", response_model=DraftResponse)
def get_draft(db: Session = Depends(get_db)):
    """Get the current draft"""
    draft = db.query(Draft).first()
    if not draft:
        raise HTTPException(status_code=404, detail="No draft found")
    return draft


@router.put("/", response_model=DraftResponse)
def update_draft(draft_update: DraftUpdate, db: Session = Depends(get_db)):
    """Update the current draft"""
    draft = db.query(Draft).first()
    if not draft:
        # Create new draft if none exists
        return save_draft(DraftCreate(**draft_update.dict()), db)

    update_data = draft_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        if field == "voice_notes" and value is not None:
            setattr(draft, field, [note.dict() for note in value])
        else:
            setattr(draft, field, value)

    db.commit()
    db.refresh(draft)
    return draft


@router.delete("/")
def delete_draft(db: Session = Depends(get_db)):
    """Delete the current draft"""
    draft = db.query(Draft).first()
    if not draft:
        raise HTTPException(status_code=404, detail="No draft found")

    db.delete(draft)
    db.commit()
    return {"message": "Draft deleted successfully"}