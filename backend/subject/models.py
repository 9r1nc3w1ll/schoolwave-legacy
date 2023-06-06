from django.db import models

from school.models import Class
from session.models import Term

class Subject(models.Model):
    class Meta:
        db_table = "subject"
    name = models.CharField(max_length=255)
    description = models.TextField()
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class SubjectSelection(models.Model):
    class Meta:
        db_table = "subject selection"
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"Subject Selection for Term: {self.term}, Subject: {self.subject}"
