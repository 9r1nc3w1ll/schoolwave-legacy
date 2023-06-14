from django.db import models

from subject.models import Subject
from school.models import Class
from account.models import User

class StudentAttendance(models.Model):
    class Meta:
        db_table = "student attendance"
    """
    This is daily students attendance 
    """
    date = models.DateField()
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
    staff = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'staff'}, related_name='staff_attendances')

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)