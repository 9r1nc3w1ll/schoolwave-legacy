from django.db import models
from account.models import User

from config.models import BaseModel
from school.models import School

# Create your models here.
ADMISSION_STATUS = (
    ('approved', 'Approved'),
    ('denied', 'Denied'),
    ('pending', 'Pending')
)

GENDERS = (
    ("male", "Male"),
    ("female", "Female")
)

class StudentInformation(BaseModel):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(null=True, blank=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=100, choices=GENDERS)



class AdmissionRequest(BaseModel):
    status = models.CharField(max_length=100, choices=ADMISSION_STATUS, default="pending")
    student_info = models.ForeignKey(StudentInformation, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def create_student_user(self, **kwargs):
        """
        USERNAME should be created based on school's preferences:
        """
        return

