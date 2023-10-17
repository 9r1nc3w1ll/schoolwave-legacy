from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, GenericAPIView
from .models import Family, FamilyRole
from .serializers import ParentSerializer, ParentRoleSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework.parsers import MultiPartParser

from account.models import User

import csv
import io

class BatchUploadFamily(GenericAPIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES['csv']

        data = csv_file.read().decode('utf-8')

        reader = csv.DictReader(io.StringIO(data))

        family_list = []

        for row in reader:
            username = row['username']
            first_name = row['first_name']
            last_name = row['last_name']
            email = row['email']
            family_name = row['family_name']
            role_name = row['role']

            user, _ = User.objects.get_or_create(username=username, first_name=first_name, last_name=last_name, email=email)
            role, _ = FamilyRole.objects.get_or_create(name=role_name.strip())

            family = Family(member=user, family_name=family_name, role=role)
            family.save()
            family_list.append(family)

        serializer = ParentSerializer(family_list, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    
class ListCreateParent(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Family.objects.all()
    serializer_class = ParentSerializer

    def get_queryset(self):
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = ParentSerializer(data=request.data)
        if serializer.is_valid():
            parent = serializer.save()
            message = "Parent created successfully."
            data = ParentSerializer(parent)

            headers = self.get_success_headers(serializer.data)

            resp = {
                    "message": message,
                    "data": serializer.data,
                }
            return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

        else:
            resp = {
                "message": "Invalid data.",
                "errors": serializer.errors,
            }
            return Response(resp, status=status.HTTP_400_BAD_REQUEST)
   
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "message": "Parent fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)
    

class RetrieveUpdateDestoryParent(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Family.objects.all()
    serializer_class = ParentSerializer

    def get_object(self):
        parent_id = self.kwargs.get("pk")
        try:
            parent = Family.objects.get(id=parent_id)
        except Family.DoesNotExist:
            return Response({"message": "Parent not found."}, status=status.HTTP_404_NOT_FOUND)
        return parent

    def retrieve(self, request, *args, **kwargs):
        parent = self.get_object()
        serializer = ParentSerializer(parent)
        resp = {
            "message": "Parent retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        parent = self.get_object()

        serializer = ParentSerializer(parent, data=data, partial=True)
        if serializer.is_valid(): 
            parent = serializer.save() 
            data = ParentSerializer(parent).data    
        
            return Response({
                "message": "Parent updated successfully.",
                "data": data
            })
        
        return Response({
            "message": "Parent not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        parent = self.get_object()
        if parent:
            parent.delete()
            resp = {
                "message": "Parent deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parent not found."}, status=status.HTTP_404_NOT_FOUND)
        

class ListCreateParentRole(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FamilyRole.objects.all()
    serializer_class = ParentRoleSerializer

    def get_queryset(self):
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs  

    def create(self, request, *args, **kwargs):
        serializer = ParentRoleSerializer(data=request.data)
        if serializer.is_valid():
            parent_role = serializer.save()
            message = "Parent role created successfully."
            data = ParentRoleSerializer(parent_role)

            headers = self.get_success_headers(serializer.data)

            resp = {
                    "message": message,
                    "data": serializer.data,
                }
            return Response(resp, status=status.HTTP_201_CREATED, headers=headers)

        else:
            resp = {
                "message": "Invalid data.",
                "errors": serializer.errors,
            }
            return Response(resp, status=status.HTTP_400_BAD_REQUEST)
   
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "message": "Parent role fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)
    

class RetrieveUpdateDestoryParentRole(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FamilyRole.objects.all()
    serializer_class = ParentRoleSerializer

    def get_object(self):
        parent_role = self.kwargs.get("name")
        try:
            parent = FamilyRole.objects.get(name=parent_role)
        except FamilyRole.DoesNotExist:
            return Response({"message": "Parent role not found."}, status=status.HTTP_404_NOT_FOUND)
        return parent

    def retrieve(self, request, *args, **kwargs):
        parent_role = self.get_object()
        serializer = ParentRoleSerializer(parent_role)
        resp = {
            "message": "Parent role retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        parent_role = self.get_object()

        serializer = ParentRoleSerializer(parent_role, data=data, partial=True)
        if serializer.is_valid(): 
            parent_role = serializer.save() 
            data = ParentRoleSerializer(parent_role).data    
        
            return Response({
                "message": "Parent role updated successfully.",
                "data": data
            })
        
        return Response({
            "message": "Parent role not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        parent_role = self.get_object()
        if parent_role:
            parent_role.delete()
            resp = {
                "message": "Parent role deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parent not found."}, status=status.HTTP_404_NOT_FOUND)