from django.db import models
from uuid import uuid4
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()


class School(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='school_logos/', null=True, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    date_of_establishment = models.DateField()
    motto = models.CharField(max_length=255, blank=True)
    website_url = models.URLField(blank=True)
    tag = models.SlugField(unique=True)

    uuid = models.UUIDField(default=uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.tag = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
