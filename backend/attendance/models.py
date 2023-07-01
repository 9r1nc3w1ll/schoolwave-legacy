from django.db import models
from config.models import BaseModel
from datetime import date

from subject.models import Subject
from school.models import Class
from account.models import User
from staff.models import Staff

class AttendanceRecord(BaseModel):
    class Meta:
        db_table = "attendance_records"
    """
    This is daily students attendance 
    """
    date = models.DateField(default=date.today)
    student = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'student'}, related_name='student_attendances')
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
    staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, blank=True, null=True)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)