from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.patient_ai_service import generate_patient_explanation

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/patient-insight")
def patient_insight(data:dict, db:Session = Depends(get_db)):

    message = generate_patient_explanation(data, db)

    return {
        "message": message
    }