from uuid import uuid4
from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    class Meta:
        abstract = True

    id = models.UUIDField(
        default=uuid4, editable=False, unique=True, primary_key=True, null=False
    )
    created_at = models.DateTimeField(default=timezone.now, null=False)
    updated_at = models.DateTimeField(default=timezone.now, null=False)
    deleted_at = models.DateTimeField(null=True)

    def save(self, *args, **kwargs):
        self.updated_at = timezone.now()
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwar):
        self.deleted_at = timezone.now()
