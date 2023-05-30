from django.db import models
from partial_date import PartialDateField

from django.conf import settings
from student.models import Student
from subject.models import Subject
from school.models import Class
from staff.models import Staff

# Create your models here.
class StudentAttendance(models.Model):
    """
    This is daily students attendance 
    """
    date = models.DateField()
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    ATTENDANCE_TYPE_CHOICES = [
        ('Daily', 'Daily'),
        ('Class', 'Class'),
    ]
    attendance_type = models.CharField(max_length=10, choices=ATTENDANCE_TYPE_CHOICES)
    present = models.BooleanField()
    remark = models.TextField()
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)

    def __str__(self):
        return f"Attendance for student {self.student} on {self.date}"

        return super().save(*args, **kwargs)