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
    tag = models.SlugField(max_length=10, unique=True, null=True)
    website_url = models.URLField(null=True)

    def __str__(self):
        return self.name


class Class(BaseModel):
    class Meta:
        db_table = "classes"

    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.TextField()
    class_index = models.PositiveSmallIntegerField(default=0)
    code = models.CharField(max_length=150, unique=True)


class ClassStaff(BaseModel):

    class Meta:
        db_table = "class_staff"
    
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, verbose_name="class")
    session = models.ForeignKey("session.Session", on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    staff = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.class_id}: {self.staff.get_full_name()}"
