from django.db import models
from account.models import User

from config.models import BaseModel

class FamilyRole(BaseModel):
    class Meta:
        db_table = "family_roles"
    name = models.CharField(max_length=255, unique=True)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)
    

class Family(BaseModel):
    class Meta:
        db_table = "families"
    member = models.OneToOneField(User, on_delete=models.CASCADE)
    family_name = models.CharField(max_length=255, default="student")
    role = models.ForeignKey(FamilyRole, on_delete=models.CASCADE)

    def save(self, *args, **kwargs):

        return super().save(*args, **kwargs)