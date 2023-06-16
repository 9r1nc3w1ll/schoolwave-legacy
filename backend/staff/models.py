from django.db import models
from account.models import User

from config.models import BaseModel

class StaffRole(BaseModel):
    class Meta:
        db_table = "staff role"
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)
    

class Staff(BaseModel):
    class Meta:
        db_table = "staff"

    # Additional fields specific to staff
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    role = models.ManyToManyField(StaffRole)  # Array of roles (e.g., ["Teacher", "Principal"])

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)