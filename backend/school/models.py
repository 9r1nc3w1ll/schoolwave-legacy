from uuid import uuid4

from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from account.models import User


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


class School(BaseModel):
    class Meta:
        db_table = "schools"

    name = models.CharField(max_length=255)
    description = models.TextField(null=True)
    logo_file_name = models.CharField(max_length=255, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    date_of_establishment = models.DateField(null=True)
    motto = models.CharField(max_length=255, null=True)
    tag = models.SlugField(max_length=10, unique=True)
    website_url = models.URLField(null=True)

    def save(self, *args, **kwargs):
        self.tag = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
