import csv
import io

from django.http import HttpResponse
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from admission.models import AdmissionRequest, StudentInformation
from admission.serializers import (
    AdmissionRequestSerializer,
    StudentInformationSerializer,
)
from school.models import School
from utils.permissions import IsSchoolOwner


# Create your views here.
class BatchUploadAdmissionRequest(APIView):
    permission_classes = [IsSchoolOwner, IsAuthenticated]
    parser_classes = [
        MultiPartParser,
    ]

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES["csv"]
        school_id = request.POST["school_id"]
        school = School.objects.get(id=school_id)

        if not csv_file.name.endswith(".csv"):
            raise ValidationError("Invalid file type")
        try:
            data = csv_file.read().decode("utf-8")
            reader = csv.DictReader(io.StringIO(data))
            entries = [line for line in reader]

            for entry in entries:
                student_info = StudentInformation(**entry)
                student_info.save()
                AdmissionRequest.objects.create(
                    student_info=student_info, school=school
                )

            data = {
                "message": "Upload complete.",
            }
            return Response(data)
        except Exception as e:
            print(e)
            raise e


class BatchUpdateAdmissionRequests(APIView):
    serializer_class = AdmissionRequestSerializer
    permission_classes = [IsSchoolOwner, IsAuthenticated]
    queryset = AdmissionRequest.objects.all()

    def get_queryset(self):
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs

    
    def patch(self, request, *args, **kwargs):
        ids = request.data.get("ids", "")
        data = request.data.get("data", {})

        if not ids:
            return Response({"error" : "Please pass in array of admission request ids to be updated."}, status=status.HTTP_400_BAD_REQUEST)

        admission_requests = self.get_queryset().filter(id__in=ids)

        for admission_request in admission_requests:
            
            if admission_request.status == "approved":
                return Response({"error": f"Admission {admission_request.id} has been approved."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = self.serializer_class(admission_request, data=data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return Response({'message': 'Bulk update successful'})

class CreateSingleAdmission(CreateAPIView):
    serializer_class = StudentInformationSerializer
    permission_classes = [IsSchoolOwner, IsAuthenticated]
    queryset = AdmissionRequest.objects.all()

    def get_queryset(self):
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        student_info = serializer.save()

        admission_request_instance = AdmissionRequest.objects.get(
            student_info=student_info
        )

        headers = self.get_success_headers(serializer.data)
        resp = {
            "message": "Admission request created successfully.",
            "data": AdmissionRequestSerializer(admission_request_instance).data,
        }
        return Response(resp, status=status.HTTP_201_CREATED, headers=headers)


class ListCreateAdmissionRequests(ListCreateAPIView):
    serializer_class = AdmissionRequestSerializer
    queryset = AdmissionRequest.objects.all()
    permission_classes = [IsSchoolOwner, IsAuthenticated]

    def get_queryset(self):
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        
        return qs

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            resp = {
                "message": "Validation error",
                "errors": serializer.errors,
            }
            return Response(resp, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
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
            "message": "Admission requests fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RUDAdmissionRequests(RetrieveUpdateDestroyAPIView):
    serializer_class = AdmissionRequestSerializer
    queryset = AdmissionRequest.objects.all()
    permission_classes = [IsSchoolOwner, IsAuthenticated]

    def get_queryset(self):
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
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
            "message": "Admission request updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "message": "Admission request deleted successfully.",
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)

class GetSampleCSV(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):

        file = open("admission/sample_admission_requests.csv", "r")

        response = HttpResponse(file, content_type="text/csv")
        response['Content-Disposition'] = 'attachment; filename=sample_admission_requests.csv'

        return response