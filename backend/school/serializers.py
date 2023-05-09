from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import School

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
    max_length=128, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class SchoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = '__all__'
