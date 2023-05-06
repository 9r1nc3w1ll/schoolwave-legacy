from django.db import models

from school.models import School

# Create your models here.
class Class(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    class_index = models.PositiveSmallIntegerField(default=1)
