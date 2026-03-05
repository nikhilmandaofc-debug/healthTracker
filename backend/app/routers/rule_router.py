from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.rules import TriageRule
from app.services.ai_rule_service import generate_rule_from_prompt

router = APIRouter(prefix="/rules", tags=["Rules"])


@router.get("/")
def get_rules(db: Session = Depends(get_db)):
    return db.query(TriageRule).all()


@router.post("/agent")
def ai_rule_agent(payload: dict, db: Session = Depends(get_db)):

    prompt = payload.get("prompt")

    overwrite = payload.get("overwrite", False)

    result = generate_rule_from_prompt(prompt, db, overwrite)

    return result