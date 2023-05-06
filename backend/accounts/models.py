from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from uuid import uuid4

# Create your models here.

class User(AbstractUser):
    USER_TYPES = (
        ('staff', 'Staff'),
        ('parent', 'Parent'),
        ('student', 'Student'),
        ('teacher', 'Teacher'),
        ('admin', 'Admin'),
        ('super_admin', 'Super_Admin'),
    )

    uuid = models.UUIDField(default=uuid4, editable=False, unique=True)
    email = models.EmailField(blank=True, null=True)
    deleted = models.BooleanField(default=False)
    role = models.CharField(max_length=50, choices=USER_TYPES, default="student")


    REQUIRED_FIELDS = []
    
    @property
    def tokens(self):
        refresh = RefreshToken.for_user(self)

        return {
            'refresh' : str(refresh),
            'access' : str(refresh.access_token)
        }
    
    def save(self, *args, **kwargs):
        if self.role == "admin" or self.role == "super_admin":
            self.is_staff = True
        return super().save(*args, **kwargs)



class PasswordResetRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=32)
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)



class AuditLog(models.Model):
    action = models.CharField(max_length=10)
    object_type = models.CharField(max_length=255, null=True)
    object_id = models.IntegerField(null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    path = models.CharField(max_length=255, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AuditLog: {self.action} - {self.object_type} ({self.object_id}) - User: {self.user.username}"
