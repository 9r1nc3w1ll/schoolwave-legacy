from jsonschema import Draft7Validator, FormatChecker
from django.conf import settings
import os
import json


def custom_validation(errors, data):
    data = data["scheme"]

    if len(data) > 20:
        errors.append("Number of grade ranges exceeds the limit of 20")

    grade_ranges = []
    for grade, values in data.items():
        grade_ranges.append((values["min"], values["max"]))

    
    grade_ranges.sort()

    previous_max = -1

    for min_value, max_value in grade_ranges:
        if min_value != previous_max + 1:
            errors.append(f"Gap found between {previous_max + 1} and {min_value - 1}")
        if min_value <= previous_max:
            errors.append(f"Collision found at grade {min_value}")
        if max_value <= previous_max:
            errors.append(f"Collision found at grade {max_value}")
        previous_max = max_value


def schema_validator(json_data):

    file_path = os.path.join(settings.BASE_DIR, "grading/schema.json")
    with open(file_path, 'r') as f:
        schema_data = f.read()
    schema = json.loads(schema_data)


    validator = Draft7Validator(schema, format_checker=FormatChecker())

    errors = []

    if len(list(validator.iter_errors(json_data))) != 0:
        return False, str(list(validator.iter_errors(json_data)))

    custom_validation(errors, json_data)

    if len(errors) > 0:
        return False, "\n".join(errors)

    return True, "valid"
