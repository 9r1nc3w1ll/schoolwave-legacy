from django.db import models
from config.models import BaseModel
from datetime import date

from subject.models import Subject
from school.models import School, Class
from account.models import User

class AttendanceRecord(BaseModel):
    class Meta:
        db_table = "attendance_records"
    
    date = models.DateField(default=date.today)
    attendee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, blank=True, null=True)
    start_time = models.TimeField(blank=True, null=True)
    end_time = models.TimeField(blank=True, null=True)
    ATTENDANCE_TYPE_CHOICES = [
        ('Daily', 'Daily'),
        ('Class', 'Class'),
    ]
    attendance_type = models.CharField(max_length=10, choices=ATTENDANCE_TYPE_CHOICES)
    present = models.BooleanField(default=False)
    remark = models.TextField()
    staff = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    ROLE_CHOICES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, blank=True, null=True)