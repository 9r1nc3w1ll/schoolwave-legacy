from django.db import models
from account.models import User

from config.models import BaseModel

class StaffRole(models.Model):
    class Meta:
        db_table = "staff role"
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()

    def __str__(self):
        return self.name
    

class Staff(BaseModel):
    class Meta:
        db_table = "staff"

    # Additional fields specific to staff
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    role = models.ManyToManyField(StaffRole)  # Array of roles (e.g., ["Teacher", "Principal"])

    def __str__(self):
        return f"{self.user} - {self.title}"