from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
import pandas as pd
import io

from app.db.database import get_db
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.ward import Ward
from app.models.rules import TriageRule

router = APIRouter(prefix="/export", tags=["Export"])

@router.get("/patients")
def export_patients(db: Session = Depends(get_db)):

    patients = db.query(Patient).all()

    data = [
        {
            "Name": p.name,
            "Severity": p.severity,
            "Status": p.status,
            "Ward": p.ward,
            "Doctor": p.doctor
        }
        for p in patients
    ]

    df = pd.DataFrame(data)

    output = io.BytesIO()

    df.to_excel(output, index=False)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=patients.xlsx"}
    )
    
@router.get("/doctors")
def export_doctors(db: Session = Depends(get_db)):

    doctors = db.query(Doctor).all()

    data = [
        {
            "Name": d.name,
            "Ward": d.ward,
            "Active Patients": d.active_patients
        }
        for d in doctors
    ]

    df = pd.DataFrame(data)

    output = io.BytesIO()

    df.to_excel(output, index=False)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=doctors.xlsx"}
    )
    
@router.get("/wards")
def export_wards(db: Session = Depends(get_db)):

    wards = db.query(Ward).all()

    data = [
        {
            "Ward Name": w.name,
            "Capacity": w.capacity,
            "Available Beds": w.available_beds
        }
        for w in wards
    ]

    df = pd.DataFrame(data)

    output = io.BytesIO()

    df.to_excel(output, index=False)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=wards.xlsx"
        }
    )
@router.get("/rules")
def export_rules(db: Session = Depends(get_db)):

    rules = db.query(TriageRule).all()

    data = [
        {
            "Parameter": r.parameter,
            "Operator": r.operator,
            "Threshold": r.threshold,
            "Category": r.category
        }
        for r in rules
    ]

    df = pd.DataFrame(data)

    output = io.BytesIO()

    df.to_excel(output, index=False)

    output.seek(0)

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": "attachment; filename=triage_rules.xlsx"
        }
    )