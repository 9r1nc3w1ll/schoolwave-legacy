from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from pyotp import TOTP
import hashlib

from account.utils import send_user_mail
from .serializers import (
    PasswordResetRequestSerializer,
    PasswordChangeSerializer,
    AdminPasswordResetSerializer,
)
from .models import PasswordResetRequest, User

from .serializers import LoginSerializer, UserSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import Group
from rest_framework import generics
from .models import User
from django.conf import settings


# Create your views here.
class LoginAPIView(APIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        # username, password
        data = request.data

        serializer = LoginSerializer(data=data)

        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )

        update_last_login(None, user)

        data = {
            "status": "success",
            "message": "Login Successful",
            "data": {
                "access_token": user.tokens["access"],
                "refresh_token": user.tokens["refresh"],
                **UserSerializer(user).data,
            },
        }
        return Response(data)


class FetchUser(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        data = {
            "status": "success",
            "message": "User retrieved successfully.",
            "data": UserSerializer(request.user).data,
        }
        return Response(data)


class ChangePassword(APIView):
    serializer_class = PasswordChangeSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    def post(self, request, *args, **kwargs):
        data = request.data

        serializer = PasswordChangeSerializer(data=data)

        serializer.is_valid(raise_exception=True)

        old_password = serializer.validated_data["old_password"]
        password = serializer.validated_data["new_password"]

        if not request.user.check_password(old_password):
            raise ValidationError("Incorrect password")

        request.user.set_password(password)

        request.user.save()

        resp = {
            "status": "success",
            "message": "Password changed successfully.",
            "data": None,
        }
        return Response(resp)


class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        # Generate OTP
        otp = TOTP("your-secret-key").now()

        # Save OTP to the database
        reset_request = PasswordResetRequest(user=request.user, otp=otp)
        reset_request.save()

        encoded_otp = hashlib.md5(otp.encode("utf-8")).hexdigest()

        # Generate reset link with encoded OTP
        reset_link = (
            f"{settings.FRONTEND_URL}/reset-password/?email={email}&hash={encoded_otp}"
        )

        # Send reset_link to email here.
        send_user_mail(email, reset_link)

        resp = {
            "status": "success",
            "message": "Reset link sent to user's email",
            "data": None,
        }

        return Response(resp)


class UserViewSet(APIView):
    def get(self, request, *args, **kwargs):
        resp = {
            "status": "success",
            "message": "User retrieved successfully.",
            "data": UserSerializer(request.user).data,
        }
        return Response(resp)

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            role = request.data.get("role")

            # Define a dictionary mapping roles to group names
            role_to_group = {
                "staff": "Staff",
                "parent": "Parent",
                "student": "Student",
                "teacher": "Teacher",
                "admin": "Admin",
                "super_admin": "Super_Admin",
            }

            # Check if the requested role is valid
            if role in role_to_group:
                # Update the user's role
                user.role = role
                user.groups.clear()

                # Get or create the group based on the requested role
                group_name = role_to_group[role]
                group, created = Group.objects.get_or_create(name=group_name)

                # Assign the group to the user
                user.groups.add(group)
            else:
                # Handle invalid role here
                # For example, raise an exception or return an error response
                # You can customize it based on your requirements
                raise ValueError("Invalid role")

            resp = {
                "status": "success",
                "message": "User created successfully.",
                "data": UserSerializer(user).data,
            }
            return Response(resp)
        else:
            resp = {
                "status": "error",
                "message": "Invalid data.",
                "errors": serializer.errors,
            }
            return Response(resp)

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            user_data = serializer.validated_data
            fields_to_update = [
                "username",
                "email",
                "role",
            ]  # Add more fields as needed
            for field in fields_to_update:
                setattr(user, field, user_data.get(field, getattr(user, field)))
            user.save()
            resp = {
                "status": "success",
                "message": "User updated successfully.",
                "data": UserSerializer(user).data,
            }
            return Response(resp)
        else:
            resp = {
                "status": "error",
                "message": "Invalid data.",
                "errors": serializer.errors,
            }
            return Response(resp)

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        resp = {"status": "success", "message": "User deleted successfully."}
        return Response(resp)


class AdminResetPassword(APIView):
    # TODO: Raise 404 if user is not in the admin's organization.

    permission_classes = [IsAuthenticated, IsAdminUser]
    serializer_class = AdminPasswordResetSerializer

    def post(self, request, *args, **kwargs):
        data = request.data

        serializer = self.serializer_class(data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.get(id=serializer.validated_data["user_id"])
        password = serializer.validated_data["password"]

        user.set_password(password)

        user.save()

        resp = {
            "status": "success",
            "message": "Password changed successfully.",
            "data": None,
        }
        return Response(resp)


class UserRoles(APIView):
    """
    {
        username,
        first_name,
        last_name,
        password,
        role
    }
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer

    # endpoint to get the roles assigned to a user
    def get(self, request, *args, **kwargs):
        user = self.get_object()
        roles = list(user.groups.values_list("name", flat=True))
        return Response({"roles": roles})
