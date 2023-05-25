from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed

from account.models import User


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


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        exclude = ["groups", "user_permissions", "deleted_at"]

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def retrieve(self, instance):
        resp = {
            "status": "success",
            "message": "User retrieved successfully",
            "user": self.data,
        }
        return resp

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        # TODO: Verify that password gets rehashed correctly
        instance.save()
        resp = {
            "status": "success",
            "message": "User updated successfully",
            "user": self.data,
        }
        return resp

    def delete(self, instance):
        instance.delete()
        resp = {
            "status": "success",
            "message": "User deleted successfully",
            "user": self.data,
        }
        return resp


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
