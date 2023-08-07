from django.db import models
from config.models import BaseModel
from school.models import School

class SchoolSettings(BaseModel):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    settings = models.JSONField()

class SchoolLogo(BaseModel):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    file = models.ImageField(upload_to="logo", blank=True, null=True)