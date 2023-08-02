from jsonschema import Draft7Validator, FormatChecker
import os
from django.conf import settings
import json


def validate(json_data):
    file_path = os.path.join(settings.BASE_DIR, "school_settings/schema.json")
    with open(file_path, 'r') as f:
        schema_data = f.read()
    schema = json.loads(schema_data)


    validator = Draft7Validator(schema, format_checker=FormatChecker())

    errors = []

    if len(list(validator.iter_errors(json_data))) != 0:
        return False, str(list(validator.iter_errors(json_data)))