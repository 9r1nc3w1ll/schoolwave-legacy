from django.db import models
from account.models import User

from config.models import BaseModel
from school.models import School

from django.db.models.signals import post_save
from django.dispatch import receiver

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
    username = models.CharField(max_length=200)
    password = models.CharField(max_length=200)
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(null=True, blank=True)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=100, choices=GENDERS)

    blood_group = models.CharField(max_length=20, null=True, blank=True)
    religion = models.CharField(max_length=20, null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    state = models.CharField(max_length=200, null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    guardian_name = models.CharField(max_length=200, null=True, blank=True)
    relation = models.CharField(max_length=200, null=True, blank=True)
    guardian_occupation = models.CharField(max_length=200, null=True, blank=True)
    guardian_phone_number = models.CharField(max_length=200, null=True, blank=True)
    guardian_address = models.TextField(blank=True, null=True)



class AdmissionRequest(BaseModel):
    status = models.CharField(max_length=100, choices=ADMISSION_STATUS, default="pending")
    student_info = models.ForeignKey(StudentInformation, on_delete=models.CASCADE)
    school = models.ForeignKey(School, on_delete=models.CASCADE)
    comment_if_declined = models.TextField(blank=True, null=True)

    def create_student_user(self, **kwargs):
        
        User.objects.create_user(
            **dict(StudentInformation.objects.filter(username=self.student_info.username).values()[0])
        )
        
        


@receiver(post_save, sender=AdmissionRequest)
def create_user_on_approved_request(sender, instance: AdmissionRequest, created, **kwargs):
    if not created:
        if instance.status == "approved":
            instance.create_student_user()