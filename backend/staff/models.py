from django.db import models
from account.models import User

class Staff(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    roles = models.JSONField(default=list)
    custom_role_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.user.get_full_name()

    def save(self, *args, **kwargs):
        if self.user.role == "staff":
            self.custom_role_id = self.user.id
        super().save(*args, **kwargs)
