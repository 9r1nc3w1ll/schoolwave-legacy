from uuid import uuid4

from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from config.models import BaseModel


class School(BaseModel):
    class Meta:
        db_table = "schools"

    name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    logo_file_name = models.CharField(max_length=255, null=True)
    owner = models.OneToOneField("account.User", on_delete=models.CASCADE, related_name="school_owner")
    date_of_establishment = models.DateField(null=True)
    motto = models.CharField(max_length=255, null=True)
    tag = models.SlugField(max_length=10, unique=True, null=True)
    website_url = models.URLField(null=True)
    
    def default_settings():
        return {
            "school_id": "",
            "school_name": "",
            "storage_options": {
                "default": True,
                "driver": "local",
                "base_path": "logo",
                "token": "token"
            },
            "staff_code_prefix": "STAFF",
            "student_code_prefix": "STUDENT",
            "logo": {
                "file": "image.png" 
            },
            "brand": {
                "primary_color": "#FFFFFF",
                "secondary_color": "#000000"
            },
            "school_latitude":  9.0820,
            "school_longitude": 8.6753,
            "school_radius": 300
        }

    settings = models.JSONField(default=default_settings)
    logo_file = models.ImageField(upload_to="logo", blank=True, null=True)

    def __str__(self):
        return self.name


    def update_settings(self, school_id, school_name, staff_code_prefix, student_code_prefix,
                        logo_file=None, primary_color="#FFFFFF", secondary_color="#000000"):
        self.settings["school_id"] = school_id
        self.settings["school_name"] = school_name
        self.settings["staff_code_prefix"] = staff_code_prefix
        self.settings["student_code_prefix"] = student_code_prefix
        self.settings["logo"]["file"] = logo_file
        self.settings["brand"]["primary_color"] = primary_color
        self.settings["brand"]["secondary_color"] = secondary_color
        self.save()
        
class Class(BaseModel):
    class Meta:
        db_table = "classes"

    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.TextField()
    class_index = models.PositiveSmallIntegerField(default=0)
    code = models.CharField(max_length=150, unique=True)


class ClassMember(BaseModel):
    class Meta:
        db_table = "class_members"

    user = models.OneToOneField("account.User", on_delete=models.CASCADE)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)