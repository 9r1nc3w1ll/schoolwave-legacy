from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
import csv
import io
from admission.serializers import AdmissionRequestSerializer
from school.models import School
from utils.permissions import IsSchoolOwner
from admission.models import AdmissionRequest, StudentInformation


# Create your views here.
class BatchUploadAdmissionRequest(APIView):
    permission_classes = [IsSchoolOwner, IsAuthenticated]
    parser_classes = [MultiPartParser,]

    def post(self, request, *args, **kwargs):
        print("files", request.FILES)
        
        csv_file = request.FILES['csv']
        school_id = request.POST["school_id"] #### CAN User have more than one school?

        school = School.objects.get(id=school_id)

        if not csv_file.name.endswith('.csv'):
            raise ValidationError("Invalid file type")

        try:
            data = csv_file.read().decode('utf-8')

            reader = csv.DictReader(io.StringIO(data))

            entries = [line for line in reader]
            
            for entry in entries:
                student_info = StudentInformation(**entry)
                student_info.save()

                req = AdmissionRequest.objects.create(
                    student_info=student_info,
                    school=school
                )
            
            data = {
                "status": "success",
                "message": "Upload complete.",
                "data": None,
            }
            return Response(data)
        except Exception as e:
            raise ValidationError(e)


class ListCreateAdmissionRequests(ListCreateAPIView):
    serializer_class = AdmissionRequestSerializer
    queryset = AdmissionRequest.objects.all()
    permission_classes = [IsSchoolOwner, IsAuthenticated]

    def get_queryset(self):
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
            "message": "Admission request created successfully.",
            "data": serializer.data,
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
            "message": "Admission requests fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RUDAdmissionRequests(RetrieveUpdateDestroyAPIView):
    serializer_class = AdmissionRequestSerializer
    queryset = AdmissionRequest.objects.all()
    permission_classes = [IsSchoolOwner, IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Admission request fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        resp = {
            "status": "success",
            "message": "Admission request updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Admission request deleted successfully.",
            "data": None,
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)

