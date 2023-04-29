from django.db import models
from django.contrib.auth.models import AbstractUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q


# Create your models here.

class User(AbstractUser):
    email = models.EmailField(blank=True, null=True)
    deleted = models.BooleanField(default=False)

    REQUIRED_FIELDS = []
       
    
    @property
    def tokens(self):
        refresh = RefreshToken.for_user(self)

        return {
            'refresh' : str(refresh),
            'access' : str(refresh.access_token)
        }

