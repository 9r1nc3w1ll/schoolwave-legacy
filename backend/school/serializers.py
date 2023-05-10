from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import School

User = get_user_model()


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'
