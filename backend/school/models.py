from uuid import uuid4

from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from account.models import User
from config.models import BaseModel


class School(BaseModel):
    class Meta:
        db_table = "schools"

    name = models.CharField(max_length=100)
    description = models.TextField(null=True)
    logo_file_name = models.CharField(max_length=255, null=True)
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    date_of_establishment = models.DateField(null=True)
    motto = models.CharField(max_length=255, null=True)
    tag = models.SlugField(max_length=10, unique=True)
    website_url = models.URLField(null=True)

    def __str__(self):
<<<<<<< HEAD
        return self.name


class Class(BaseModel):
    class Meta:
        db_table = "classes"

    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.TextField()
    class_index = models.PositiveSmallIntegerField(default=0)
=======
        return self.name
>>>>>>> f9babbc (User Management CRUD endpoints for single and multiple users)
