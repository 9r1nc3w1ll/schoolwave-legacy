from django.db import models
from config.models import BaseModel

from school.models import School, Class
from session.models import Term
from staff.models import Staff, StaffRole

class Subject(BaseModel):
    class Meta:
        db_table = "subjects"
    name = models.CharField(max_length=255)
    description = models.TextField()
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    code = models.CharField(max_length=150, unique=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)


class SubjectSelection(BaseModel):
    class Meta:
        db_table = "subject_selections"
    # term = models.ForeignKey(Term, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    
    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)

class SubjectStaffAssignment(BaseModel):
    class Meta:
        db_table = 'subject_staff_assignments'

    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    role = models.ForeignKey(StaffRole, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    active = models.BooleanField(null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)    

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)