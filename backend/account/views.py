import hashlib

from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group, update_last_login
from django.shortcuts import get_object_or_404
from pyotp import TOTP
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from account.utils import send_user_mail
from school.models import School, ClassMember
from school.serializers import SchoolSerializer, ClassMemberSerializer
from rest_framework.generics import RetrieveUpdateAPIView, CreateAPIView

from .models import PasswordResetRequest, User
from .serializers import (
    AdminPasswordResetSerializer,
    LoginSerializer,
    PasswordChangeSerializer,
    PasswordResetRequestSerializer,
    UserSerializer,
    ProfilePhotoSerializer,
    SuperAdminCreateSerializer
)


# Create your views here.
class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = LoginSerializer(data=data)

        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

        authUser = authenticate(
            request=request,
            username=serializer.data.get("username"),
            password=serializer.data.get("password"),
        )

        if not authUser:
            response = {"message": "Invalid credentials"}
            return Response(status=status.HTTP_401_UNAUTHORIZED, data=response)

        update_last_login(User, authUser)
        user: User = User.objects.get(username=authUser.get_username())

        try:
            # TODO: Fetch the school that the user is trying to access
            # from a request header
            school = School.objects.get(owner=user)
            schoolData = SchoolSerializer(school).data
        except School.DoesNotExist:
            schoolData = None

        data = {
            "message": "Login Successful",
            "data": {
                "access_token": user.tokens["access"],
                "refresh_token": user.tokens["refresh"],
                "user": UserSerializer(user).data,
                "school": schoolData,
            },
        }

        return Response(data)


class FetchUser(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        data = {
            "message": "User retrieved successfully.",
            "data": UserSerializer(request.user).data,
        }
        return Response(data)


class RefreshAuthUser(APIView):
    permission_classes = [
        IsAuthenticated,
    ]

    def get(self, request, *args, **kwargs):
        try:
            # TODO: Fetch the school that the user is trying to access
            # from a request header
            school = School.objects.get(owner=request.user)
            schoolData = SchoolSerializer(school).data
        except School.DoesNotExist:
            schoolData = None

        data = {
            "message": "User refresh successful",
            "data": {
                # NB: Do not refresh or return new tokens here
                # Return a fresh copy of the JWT data excluding tokens
                "user": UserSerializer(request.user).data,
                "school": schoolData,
            },
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

        resp = {"message": "Password changed successfully."}
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

        resp = {"message": "Reset link sent to user's email"}

        return Response(resp)


class UserViewSet(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        """
        Modify in case there are several users
        """
        user = User.objects.get(id=self.request.user_id)

        qs = self.queryset.filter(user=user)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            message = "User created successfully."
            data = UserSerializer(user).data

            resp = {
                "message": message,
                "data": data,
            }
            return Response(resp, status=status.HTTP_201_CREATED)
        else:
            resp = {
                "message": "Invalid data.",
                "errors": serializer.errors,
            }
            return Response(resp, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request, *args, **kwargs):
        user_id = kwargs.get("user_id")

        if user_id:
            try:
                user = User.objects.get(id=user_id)
                data = UserSerializer(user).data
                message = "User retrieved successfully."
            except User.DoesNotExist:
                return Response({"message": "User not found."})
        else:
            users = User.objects.all()
            data = UserSerializer(users, many=True).data
            message = "Users retrieved successfully."

        resp = {
            "message": message,
            "data": data,
        }
        return Response(resp)


class RetrieveUpdateDestroyUser(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "user_id"

    def get_object(self):
        user_id = self.kwargs.get("user_id")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"message": "User not found."})
        return user

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = UserSerializer(user)
        return Response(
            {"message": "User retrieved successfully.", "data": serializer.data}
        )

    def patch(self, request, *args, **kwargs):
        data = request.data
        user = self.get_object()

        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            message = "User updated successfully."
            data = UserSerializer(user).data

            return Response({"message": message, "data": data})

        return Response({"message": "Invalid data.", "errors": serializer.errors})

    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        resp = {
            "message": "User deleted successfully.",
        }
        return Response(resp, status=status.HTTP_204_NO_CONTENT)


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
            "message": "Password changed successfully.",
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

    def get(self, request, *args, **kwargs):
        user = request.user
        roles = list(user.groups.values_list("name", flat=True))
        return Response({"roles": roles})


class UserClass(APIView):
    permission_classes = [IsAuthenticated]
    queryset = ClassMember.objects.all()
    serializer_class = ClassMemberSerializer

    def get(self, request, *args, **kwargs):
        user = request.user
        try:
            user = ClassMember.objects.get(user=user)
            data = ClassMemberSerializer(user).data
            message = "User class retrieved successfully."
        except ClassMember.DoesNotExist:
            return Response({"message": "User not assigned to a class"})
        resp = {
            "message": message,
            "data": data,
        }
        return Response(resp)
    

class RetrieveUpdateUserProfile(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "user_id"
    
    def get_object(self):
        return self.request.user
    
    def get(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = UserSerializer(user)
        return Response(
            {"message": "User Profile retrieved successfully.", "data": serializer.data}
        )
    
    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        
        # Create a mutable copy of request.data
        user_data = request.data.copy()
        
        # Pop the profile_photo data from the mutable copy
        profile_photo_data = user_data.pop("profile_photo", None)

        serializer = UserSerializer(user, data=user_data, partial=True)
        if serializer.is_valid():
            if profile_photo_data:
                # Update the profile photo if data is provided
                profile_photo_serializer = ProfilePhotoSerializer(instance=user.profile_photo, data=profile_photo_data)
                if profile_photo_serializer.is_valid():
                    profile_photo_serializer.save()

            user = serializer.save()
            message = "User Profile updated successfully."
            data = UserSerializer(user).data

            return Response({"message": message, "data": data})

        return Response({"message": "Invalid data.", "errors": serializer.errors})

class SuperAdminCreateView(CreateAPIView):
    serializer_class = SuperAdminCreateSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Super admin created successfully.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
