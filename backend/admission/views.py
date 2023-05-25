from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
import csv
import io
from utils.permissions import IsSchoolOwner
from .models import StudentInformation


# Create your views here.
class BatchUploadAdmissionRequest(APIView):
    permission_classes = [IsSchoolOwner, IsAuthenticated]
    parser_classes = [MultiPartParser,]

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES['csv']

        if not csv_file.name.endswith('.csv'):
            raise ValidationError("Invalid file type")

        try:
            data = csv_file.read().decode('utf-8')

            reader = csv.DictReader(io.StringIO(data))

            entries = [line for line in reader]
            
            for entry in entries:
                student_info = StudentInformation(**entry)
                student_info.save()
            
            data = {
                "status": "success",
                "message": "Upload complete.",
                "data": None,
            }
            return Response(data)
        except Exception as e:
            raise ValidationError(e)


class ListAdmissionRequests(ListAPIView):
    return