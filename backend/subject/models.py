from django.db import models
from config.models import BaseModel

from school.models import Class
from session.models import Term
from staff.models import Staff, StaffRole

class Subject(BaseModel):
    class Meta:
        db_table = "subject"
    name = models.CharField(max_length=255)
    description = models.TextField()
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    code = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.name


class SubjectSelection(BaseModel):
    class Meta:
        db_table = "subject selection"
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"Subject Selection for Term: {self.term}, Subject: {self.subject}"


class SubjectStaffAssignment(BaseModel):
    class Meta:
        db_table = 'subject staff assignment'

    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    role = models.ForeignKey(StaffRole, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    active = models.BooleanField(null=True)