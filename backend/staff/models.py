from django.db import models
from account.models import User
from school.models import School

from config.models import BaseModel

class StaffRole(BaseModel):
    class Meta:
        db_table = "staff_roles"
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    school = models.ForeignKey(School, on_delete=models.CASCADE, null=True, blank=True)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)
    

class Staff(BaseModel):
    class Meta:
        db_table = "staffs"
        unique_together = ("school", "staff_number")

    # Additional fields specific to staff
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True)
    title = models.CharField(max_length=255)
    roles = models.ManyToManyField(StaffRole)  # Array of roles (e.g., ["Teacher", "Principal"])
    staff_number = models.CharField(max_length=20, null=True, blank=True)
    school = models.ForeignKey(School, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)