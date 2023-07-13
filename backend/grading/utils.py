from jsonschema import Draft7Validator
from django.conf import settings
import os
import json

def schema_validator(json_data):
    
    file_path = os.path.join(settings.BASE_DIR, "grading/schema.json")
    with open(file_path, 'r') as f:
        schema_data = f.read()
    schema = json.loads(schema_data)
    
    validator = Draft7Validator(schema)

    if len(list(validator.iter_errors(json_data))) != 0:
        return False, str(list(validator.iter_errors(json_data)))
    
    return True, "valid"