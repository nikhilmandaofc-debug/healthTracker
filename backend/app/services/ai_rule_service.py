import json
import re

from app.models.rules import TriageRule
from app.models.ai_models import deepseek_v3


def generate_rule_from_prompt(prompt: str, db, overwrite=False):

    system_prompt = """
You are a hospital triage rule generator.

Extract rule information from the user prompt.

Allowed parameters:
oxygen_level
heart_rate
temperature
blood_pressure

Allowed operators:
<
<=
>
>=

Categories:
Critical
Moderate
Stable


Return JSON ONLY.

Example:

{
 "parameter": "oxygen_level",
 "operator": "<",
 "threshold": 88,
 "category": "Critical"
}
"""

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]

    response = deepseek_v3.invoke(messages)

    result = response.content

    cleaned = re.sub(r"```json|```", "", result).strip()

    try:
        data = json.loads(cleaned)
    except:
        return {
            "status": "error",
            "message": "AI returned invalid rule format. Please try again."
        }

    required_fields = [
        "parameter",
        "operator",
        "threshold",
        "category"
    ]

    missing = []

    for field in required_fields:
        if field not in data:
            missing.append(field)

    if missing:
        return {
            "status": "missing",
            "message": f"Missing fields: {', '.join(missing)}"
        }

    # -------------------------
    # Check existing rule
    # -------------------------

    existing = db.query(TriageRule).filter(
        TriageRule.parameter == data["parameter"],
        TriageRule.operator == data["operator"],
        TriageRule.threshold == data["threshold"]
    ).first()

    # Rule exists and overwrite not requested
    if existing and not overwrite:

        return {
            "status": "exists",
            "message": f"Rule already exists for {data['parameter']} {data['operator']} {data['threshold']}. Do you want to overwrite?",
            "rule": data
        }

    # Overwrite existing rule
    if existing and overwrite:

        existing.category = data["category"]
        existing.ward = data["ward"]

        db.commit()

        return {
            "status": "updated",
            "message": "Rule overwritten successfully",
            "rule": data
        }

    # Create new rule

    rule = TriageRule(
        parameter=data["parameter"],
        operator=data["operator"],
        threshold=data["threshold"],
        category=data["category"],
        ward=data["ward"]
    )

    db.add(rule)
    db.commit()

    return {
        "status": "created",
        "message": "Rule created successfully",
        "rule": data
    }