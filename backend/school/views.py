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
from .models import School

User = get_user_model()


class AppStatusView(APIView):
    def get(self, request):
        step1 = User.objects.count() != 0
        # checks if there is user
        if step1:
            step2 = School.objects.count() != 0
            # checks if there is school
            if step2:
                return Response({'step1': True, 'step2': True})
            else:
                return Response({'step1': True, 'step2': False})
        else:
            return Response({'step1': False, 'step2': False})


class UserAPIView(GenericAPIView):
    
    serializer_class = UserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return response.Response(serializer.data, status=status.HTTP_201_CREATED)

        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class SchoolAPIView(APIView):
    def post(self, request):
        serializer = SchoolSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
