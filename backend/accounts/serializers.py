from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(min_length=5)

    def validate(self, data):
        user = authenticate(username=data.get('username'), password=data.get('password'))

        if not user:
            raise AuthenticationFailed('Invalid login credentials')
        return data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        exclude = ("id", "groups", "user_permissions", "is_active", "deleted")