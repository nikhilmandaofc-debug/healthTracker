from app.models.rules import TriageRule
from app.models.ai_models import deepseek_v3


def generate_patient_explanation(patient, db):

    rules = db.query(TriageRule).all()

    rules_text = ""

    for r in rules:

        rules_text += f"{r.parameter} {r.operator} {r.threshold} → {r.category}\n"

    prompt = f"""
You are a hospital triage AI.

Hospital severity rules:

{rules_text}

Patient information:

Name: {patient["name"]}

Vitals:

Heart Rate: {patient["heart_rate"]}
Oxygen Level: {patient["oxygen_level"]}
Temperature: {patient["temperature"]}

Tasks:

1. Determine which rule applies to this patient
2. Determine the severity category
3. Explain in simple medical language why the rule applies

Return response like:

Severity: <category>

Explanation: <reason>
"""

    messages = [
        {"role": "system", "content": "You are a hospital triage AI assistant."},
        {"role": "user", "content": prompt}
    ]

    response = deepseek_v3.invoke(messages)

    return response.content