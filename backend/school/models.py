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


class ClassMember(BaseModel):
    class Meta:
        db_table = "class_members"

    user = models.ForeignKey("account.User", on_delete=models.CASCADE)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)
