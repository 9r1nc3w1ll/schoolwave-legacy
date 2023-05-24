from uuid import uuid4

from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.db.models import Q
from django.utils import timezone
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from config.models import BaseModel

USER_TYPES = (
    ("staff", "Staff"),
    ("parent", "Parent"),
    ("student", "Student"),
    ("teacher", "Teacher"),
    ("admin", "Admin"),
    ("super_admin", "Super_Admin"),
)


class User(BaseModel, AbstractUser):
    class Meta:
        db_table = "users"

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(null=True)
    role = models.CharField(max_length=50, choices=USER_TYPES, default="student")
    objects = UserManager()

    @property
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {"refresh": str(refresh), "access": str(refresh.access_token)}

    def save(self, *args, **kwargs):
        if self.role == "admin" or self.role == "super_admin":
            self.is_staff = True
        return super().save(*args, **kwargs)


class PasswordResetRequest(BaseModel):
    class Meta:
        db_table = "password_reset_requests"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    otp = models.CharField(max_length=32)


class AuditLog(BaseModel):
    class Meta:
        db_table = "audit_log"

    actor = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=10)
    object_type = models.CharField(max_length=100, null=True)
    object_id = models.IntegerField(null=True)
    path = models.CharField(max_length=255, null=True)
    status = models.CharField(max_length=50, null=True)
    status_code = models.SmallIntegerField(null=True)

    def __str__(self):
        return f"AuditLog: {self.action} - {self.object_type} ({self.object_id}) - User: {self.actor.username}"
