from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from account.models import User
from account.serializers import SchoolAdminSerializer
from school.models import School
from school.serializers import SchoolSerializer


class AppStatusView(APIView):
    def get(self, request):
        step1 = User.objects.count() != 0
        step2 = School.objects.count() != 0
        return Response({"step1": step1, "step2": step2})


class CreateOwner(APIView):
    def post(self, request):
        serializer = SchoolAdminSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

        serializer.save(is_active=True, role="admin")

        if (
            authenticate(
                request=request,
                username=request.data.get("username"),
                password=request.data.get("password"),
            )
            is None
        ):
            message = "user authentication failed"  # TODO: Log this error
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={message}
            )

        user = User.objects.get(username=serializer.data.get("username"))
        if user is None:
            message = "user not found"  # TODO: Log this error
            return Response(
                status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={message}
            )

        resp = {
            "message": "User created successfully.",
            "user": serializer.data,
            "token": {
                "access_token": user.tokens["access"],
                "refresh_token": user.tokens["refresh"],
            },
        }

        return Response(resp)


class CreateSchool(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        serializer = SchoolSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

        serializer.save()
        resp = {
            "message": "School created successfully.",
            "data": None,
        }

        return Response(resp, status=status.HTTP_201_CREATED)
