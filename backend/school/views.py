from django.shortcuts import render
from django.http import HttpRequest
from rest_framework.generics import GenericAPIView
from rest_framework import generics, response, status
from school.serializers import SchoolSerializer
from accounts.serializers import UserSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from .models import School

User = get_user_model()

class AppStatusView(APIView):
    def get(self, request):
        step1 = User.objects.count() != 0
        step2 = School.objects.count() != 0
        return Response({'step1': step1, 'step2': step2})


class UserAPIView(GenericAPIView):
    # when the user is created, we need to login the user and take the token
    
    serializer_class = UserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)


        if serializer.is_valid():
            serializer.save()
            resp = {
                "message": "User created successfully.",
                "data": None
            }
            return Response(resp)
        raise ValidationError("Failed to create user")



class SchoolAPIView(APIView):
    def post(self, request):
        serializer = SchoolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            resp = {
                "message": "School created successfully.",
                "data": None
            }
            return Response(resp)
        raise ValidationError("Failed to create school")
