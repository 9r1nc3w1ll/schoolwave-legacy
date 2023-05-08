from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError, AuthenticationFailed
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .serializers import LoginSerializer, UserSerializer
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from .models import User

# Create your views here.
class LoginAPIView(APIView):

    def post(self, request, *args, **kwargs):
        # username, password
        data = request.data

        try:
            username = data["username"]
            password = data["password"]
        except Exception as e:
            raise ValidationError(f"{e.args[0]} is required.")
        
        serializer = LoginSerializer(data=request.data)

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


class AdminResetPassword(APIView):
    # TODO: Raise 404 if user is not in the admin's organization.
    
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):

        data = request.data

        try:
            user_id = data["user_id"]
            password = data["password"]

            user = User.objects.get(id=user_id)
        except KeyError as e:
            raise ValidationError(f'{e.args[0]} is required')
        except User.DoesNotExist:
            raise ValidationError("User with given id does not exist.")
        
        
        user.set_password(password)
        
        user.save()

        resp = {
            "status": "success",
            "message": "Password changed successfully.",
            "data": None
        }
        return Response(resp)



        
