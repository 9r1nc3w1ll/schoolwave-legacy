from rest_framework.response import Response
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Session
from school.models import School
from utils.permissions import IsSchoolOwner


class ListCreateSession(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Session.objects.all()

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "Session created successfully.",
            "data": serializer.data
        }
        return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "status": "success",
            "message": "Sessions fetched successfully.",
            "data": serializer.data
        }
        return Response(resp)


class RetrieveUpdateDestorySession(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Session.objects.all()

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Session fetched successfully.",
            "data": serializer.data
        }
        return Response(resp)
    
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        resp = {
            "status": "success",
            "message": "Session updated successfully.",
            "data": serializer.data
        }
        return Response(resp)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Session updated successfully.",
            "data": None
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)
    
