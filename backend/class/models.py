from django.db import models

from config.models import BaseModel
from school.models import School


class Class(BaseModel):
    class Meta:
        db_table = "classes"

    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    description = models.TextField()
    class_index = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["created_at"]
