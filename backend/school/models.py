from django.db import models
from uuid import uuid4
from accounts.models import User

class TrackingModel(models.Model):
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True
        ordering = ('-created_at',)

class School(TrackingModel, models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='school_logos/', null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    date_of_establishment = models.DateField()
    motto = models.CharField(max_length=255, blank=True)
    website_url = models.URLField(blank=True)
    tag = models.UUIDField(default=uuid4, editable=False, unique=True)

    def __str__(self):
        return self.name
