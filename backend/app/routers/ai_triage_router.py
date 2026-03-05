from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.ai_triage_engine import run_ai_triage

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/triage")

def ai_triage(patient: dict, db: Session = Depends(get_db)):

    result = run_ai_triage(db, patient)

    return result