from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from account.models import User, ProfilePhoto
from school.serializers import SchoolSerializer


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()
    reset_link = serializers.CharField(read_only=True)

    def validate(self, data):
        email = data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        return data


class AdminPasswordResetSerializer(serializers.Serializer):
    user_id = serializers.CharField(error_messages={"required": "user_id is required"})
    password = serializers.CharField(
        min_length=5,
        error_messages={
            "required": "Password is required",
            "blank": "Password field cannot be empty",
        },
    )

    def validate(self, data):
        user_id = data.get("user_id")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")
        return data


class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        min_length=5,
        error_messages={
            "required": "Old password is required",
            "blank": "Password field cannot be empty",
        },
    )
    new_password = serializers.CharField(
        min_length=5,
        error_messages={
            "required": "Old password is required",
            "blank": "Password field cannot be empty",
        },
    )


class PasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=5,
        error_messages={
            "required": "Password is required",
            "blank": "Password field cannot be empty",
        },
    )
    confirm_password = serializers.CharField(
        min_length=5,
        error_messages={
            "required": "Confirm password is required",
            "blank": "Confirm password field cannot be empty",
        },
    )

    hashed_email = serializers.CharField()
    token = serializers.CharField()

    def validate(self, data):
        password = data.get("password")
        confirm_password = data.get("confirm_password")

        if password != confirm_password:
            raise serializers.ValidationError("Passwords must match!")
        
        return data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=50)
    password = serializers.CharField(min_length=5)

    def validate(self, data):
        user = authenticate(
            username=data.get("username"), password=data.get("password")
        )

        if not user:
            raise AuthenticationFailed("Invalid login credentials")
        return data





class ProfilePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfilePhoto
        fields = ["file"]

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_photo = ProfilePhotoSerializer(required=False)
    school = serializers.StringRelatedField()

    class Meta:
        model = User
        exclude = ["groups", "user_permissions", "deleted_at"]
    
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user




class OwnerSerializer(UserSerializer):
    email = serializers.EmailField()

    # TODO: Enforce strong password rule for admin
    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
        ]

class SuperAdminCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
        ]

    def create(self, validated_data):
        user = User.objects.create_superuser(**validated_data, role='super_admin')
        return user
