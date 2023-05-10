from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q


# Create your models here.

class User(AbstractUser):
    email = models.EmailField(blank=True, null=True)
    deleted = models.BooleanField(default=False)
    role = models.CharField(max_length=50, blank=True, null=True)


    REQUIRED_FIELDS = []

    REQUESTED_ACCOUNT_TYPE_CHOICES = (
        ('staff', 'Staff'),
        ('parent', 'Parent'),
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
        ('super_admin', 'Super_Admin'),
    )
    APPROVAL_CHOICES = (
        ('n', 'Not Requested For Approval'),
        ('p', 'Approval Application on Pending'),
        ('d', 'Approval Request Declined'),
        ('a', 'Verified')
    )
    approval_status = models.CharField(
        max_length=2,
        choices=APPROVAL_CHOICES,
        default='n',
    )
    requested_role = models.CharField(
        choices=REQUESTED_ACCOUNT_TYPE_CHOICES,
        max_length=50,
        default=REQUESTED_ACCOUNT_TYPE_CHOICES[0][0]
    )
    
       
    
    @property
    def tokens(self):
        refresh = RefreshToken.for_user(self)

        return {
            'refresh' : str(refresh),
            'access' : str(refresh.access_token)
        }

