from django.db import models
from partial_date import PartialDateField

from school.models import School


class Session(models.Model):
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    resumption_date = models.DateField()
    start_date = PartialDateField(blank=True, null=True)
    end_date = PartialDateField(blank=True, null=True)
    name = models.CharField(max_length=255)
    active = models.BooleanField(default=True)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def save(self, *args, **kwargs):
        self.name = f"{self.start_date} / {self.end_date}"

        return super().save(*args, **kwargs)

    class Meta:
        unique_together = ("school", "name")


class Term(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    name = models.CharField(
        max_length=255
    )  # CharField (because Term could mean semester later on)
    active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("session", "name")
