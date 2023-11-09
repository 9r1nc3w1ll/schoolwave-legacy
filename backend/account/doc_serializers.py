from rest_framework import serializers
from .serializers import UserSerializer, SchoolSerializer


class TokenResponseSerializer(serializers.Serializer):
    access_token = serializers.UUIDField()
    refresh_token = serializers.UUIDField()
    user = UserSerializer()


class RefreshAuthUserSerializer(serializers.Serializer):
    user = UserSerializer()
    school = SchoolSerializer()