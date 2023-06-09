from django.db import models
from partial_date import PartialDateField

from config.models import BaseModel
from school.models import School


class Session(BaseModel):
    class Meta:
        db_table = "sessions"
        unique_together = ("school", "name", "active")

    name = models.CharField(max_length=50)
    active = models.BooleanField(null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    start_date = PartialDateField()
    end_date = PartialDateField()
    resumption_date = models.DateField()

    def save(self, *args, **kwargs):
        self.name = f"{self.start_date}/{self.end_date}"

        return super().save(*args, **kwargs)


class Term(BaseModel):
    class Meta:
        db_table = "terms"
        unique_together = ("session", "name", "active")

    name = models.CharField(max_length=50)
    active = models.BooleanField(null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    code = models.CharField(max_length=150, unique=True)
