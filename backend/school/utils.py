from jsonschema import Draft7Validator, FormatChecker
import os
from django.conf import settings
import json
import requests
from django.core.files.base import ContentFile


def validate(json_data):
    file_path = os.path.join(settings.BASE_DIR, "school/schema.json")
    with open(file_path, 'r') as f:
        schema_data = f.read()
    schema = json.loads(schema_data)

    json_data = json_data["settings"]


    validator = Draft7Validator(schema, format_checker=FormatChecker())

    if len(list(validator.iter_errors(json_data))) != 0:
        return False, str(list(validator.iter_errors(json_data)))
    
    return True, "Validation successful"


def attach_remote_image(school, remote_url):
    response = requests.get(remote_url)

    if response.status_code == 200:
        image_name = os.path.basename(remote_url)
        school.logo_file.save(image_name, ContentFile(response.content), save=False)

        school.settings["logo"]["file"] = image_name
        school.save()

        return True
    return False