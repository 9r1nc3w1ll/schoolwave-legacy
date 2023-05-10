from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from pyotp import TOTP
import hashlib

from accounts.utils import send_user_mail
from .serializers import PasswordResetRequestSerializer
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
        
        serializer = LoginSerializer(data)

        serializer.is_valid(raise_exception=True)

        
        user = authenticate(
            username=serializer.validated_data['username'], 
            password=serializer.validated_data['password']
        )

        update_last_login(None, user)

        data = {
            "status": "success",
            "message": "Login Successful",
            "data": {
                "access_token" : user.tokens["access"],
                "refresh_token" : user.tokens["refresh"],
                **UserSerializer(user).data
            }
        }
        return Response(data)
        


class FetchUser(APIView):

    permission_classes = [IsAuthenticated,]

    def get(self, request, *args, **kwargs):
        data = {
            "status": "success",
            "message": "User retrieved successfully.",
            "data": UserSerializer(request.user).data
        }
        return Response(data)


class ChangePassword(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request, *args, **kwargs):

        data = request.data

        try:
            old_password = data['old_password']
            password = data["new_password"]

            if not request.user.check_password(old_password):
                raise ValidationError("Invalid credentials")
        except KeyError as e:
            raise ValidationError(f'{e.args[0]} is required')
        
        request.user.set_password(password)
        
        request.user.save()

        resp = {
            "status": "success",
            "message": "Password changed successfully.",
            "data": None
        }
        return Response(resp)




        

class PasswordResetRequestView(APIView):
    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise ValidationError('User not found.')

        # Generate OTP
        otp = TOTP('your-secret-key').now()

        # Save OTP to the database
        reset_request = PasswordResetRequest(user=user, otp=otp)
        reset_request.save()

        encoded_otp = hashlib.md5(otp.encode('utf-8')).hexdigest()

        # Generate reset link with encoded OTP
        reset_link = f'{settings.FRONTEND_URL}/reset-password/?email={email}&hash={encoded_otp}'

        # Send reset_link to email here.
        send_user_mail(email, reset_link)
        
        resp = {
            "status": "success",
            "message": "Reset link sent to user's email",
            "data": None
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
    
    # endpoint to assign a role to a user
    permission_classes = [IsAuthenticated,]
    
    def post(self, request, *args, **kwargs):
        user = self.get_object()
        role = request.data.get('role')

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
            raise ValueError('Invalid role')

        # Save the user object
        user.save()
        resp = {
            "status": "success",
            "message": "User assigned role successfully",
            "data": None
            }

        return Response(resp)
        
    # endpoint to get the roles assigned to a user
    def get(self, request, *args, **kwargs):
        user = self.get_object()
        roles = list(user.groups.values_list('name', flat=True))
        return Response({'roles': roles})


