from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    requested_role = serializers.SerializerMethodField()

    password = serializers.CharField(
    max_length=128, min_length=6, write_only=True)

    class Meta:
        model = User
        fields = ['id','username', 'first_name', 'last_name', 'email', 'password', 'approval_status', 'requested_role']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def requested_role(self, obj):
        return list(obj.groups.values_list('name', flat=True))
