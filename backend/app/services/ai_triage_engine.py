import json
from app.models.ai_models import  (
    deepseek_r1,
    gpt4o,
    gpt4o_mini,
    deepseek_v3,
    llama_33,
    embeddings_model
)
from app.models.rules import TriageRule
from app.models.doctor import Doctor
from app.models.ward import Ward


def run_ai_triage(db, patient):

    rules = db.query(TriageRule).all()
    doctors = db.query(Doctor).all()
    wards = db.query(Ward).all()

    rule_text = []

    for r in rules:
        rule_text.append(
            f"If {r.parameter} {r.operator} {r.threshold} then category={r.category} "
        )

    doctor_text = []

    for d in doctors:
        doctor_text.append(
            f"{d.name} works in ward {d.ward} and has {d.active_patients} patients"
        )

    ward_list = [w.name for w in wards]

    prompt = f"""
You are an AI hospital triage system.

Determine the correct severity, ward and doctor.

Patient Information:

Name: {patient["name"]}
Age: {patient["age"]}
Gender: {patient["gender"]}

Vitals:

Heart Rate: {patient["heart_rate"]}
Oxygen Level: {patient["oxygen_level"]}
Temperature: {patient["temperature"]}
Blood Pressure: {patient["blood_pressure"]}

Symptoms:
{patient["symptoms"]}

Hospital Rules:

{rule_text}

Available Wards:

{ward_list}

Doctors:

{doctor_text}

Tasks:

1. Determine severity (Critical, Moderate, Stable)
2. Choose the best ward
3. Choose the doctor with lowest patient load in that ward
4. Explain the decision

Return JSON ONLY:

{{
 "severity": "",
 "ward": "",
 "doctor": "",
 "reason": ""
}}
"""

    response = deepseek_v3.invoke(prompt)

    try:
        result = json.loads(response.content)
    except:
        result = {
            "severity": "Unknown",
            "ward": "General",
            "doctor": "Not Assigned",
            "reason": response.content
        }

    return result