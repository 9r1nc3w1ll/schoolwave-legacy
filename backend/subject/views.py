from rest_framework.views import APIView
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Subject, SubjectSelection
from .serializers import SubjectSerializer, SubjectSelectionSerializer
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
import csv
import io
from session.models import Term
from school.models import Class

class BatchUploadSubjects(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES.get('csv')
        term_id = request.data.get('term_id')

        if not csv_file:
            raise ValidationError("No CSV file provided")

        if not csv_file.name.endswith('.csv'):
            raise ValidationError("Invalid file type. Only CSV files are allowed")

        try:
            term = Term.objects.get(id=term_id)
            data = csv_file.read().decode('utf-8')

            reader = csv.DictReader(io.StringIO(data))

            created_subjects = []
            for row in reader:
                class_code = row.get('Class Code')
                subject_name = row.get('Subject Name')
                subject_description = row.get('Subject Description')
                subject_code = row.get('Subject Code')

                class_info, created = Class.objects.get_or_create(code=class_code)
                subject = Subject.objects.create(
                    name=subject_name,
                    description=subject_description,
                    class_id=class_info,
                    term=term,
                    code=subject_code
                )
                created_subjects.append(subject)

            data = {
                "message": "Batch upload complete.",
                "created_subjects": [str(subject) for subject in created_subjects]
            }
            return Response(data)

        except Exception as e:
            raise ValidationError(str(e))

class ListCreateSubject(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    def get_queryset(self):
        subject_id = self.kwargs.get("subject_id")
        if subject_id:
            return self.queryset.filter(id=subject_id)
        else:
            return self.queryset.all()
        
    
    def create(self, request, *args, **kwargs):
        serializer = SubjectSerializer(data=request.data)
        if serializer.is_valid():
            subject = serializer.save()
            message = "Subject created successfully."
            data = SubjectSerializer(subject)

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
            "message": "Subject fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

class RetrieveUpdateDestroySubject(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

    def get_object(self):
        subject_id = self.kwargs.get("pk")
        try:
            subject = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            return Response({
                    'error': 'Subject not found.'
                    })
        return subject

    def retrieve(self, request, *args, **kwargs):
        subject = self.get_object()
        serializer = SubjectSerializer(subject)
        resp = {
            "message": "Subject retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        subject = self.get_object()

        serializer = SubjectSerializer(subject, data=data, partial=True)
        if serializer.is_valid(): 
            subject = serializer.save() 
            message = "Subject updated successfully."
            data = SubjectSerializer(subject).data    
        
            return Response({
                "message": message,
                "data": data
            })
        
        return Response({
            "error": "Subject not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        subject = self.get_object()
        if subject:
            subject.delete()
            resp = {
                "message": "Subject deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Subject not found."}, status=status.HTTP_404_NOT_FOUND)


class ListCreateSubjectSelection(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SubjectSelection.objects.all()
    serializer_class = SubjectSelectionSerializer

    def get_queryset(self):
        subjectselection_id = self.kwargs.get("subjectselection_id")
        if subjectselection_id:
            return self.queryset.filter(id=subjectselection_id)
        else:
            return self.queryset.all()

        

    def create(self, request, *args, **kwargs):
        serializer = SubjectSelectionSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            message = "Subject Selection created successfully."
            data = SubjectSelectionSerializer(student)

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
            "message": "Subject Selection fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RetrieveUpdateDestroySubjectSelection(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = SubjectSelection.objects.all()
    serializer_class = SubjectSelectionSerializer

    def get_object(self):
        subjectselection_id = self.kwargs.get("pk")
        try:
            subjectselection = SubjectSelection.objects.get(id=subjectselection_id)
        except SubjectSelection.DoesNotExist:
            return Response({
                    'error': 'Subject Selection not found.'
                    })
        return subjectselection

    def retrieve(self, request, *args, **kwargs):
        subjectselection = self.get_object()
        serializer = SubjectSelectionSerializer(subjectselection)
        resp = {
            "message": "Subject Selection retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        subjectselection = self.get_object()

        serializer = SubjectSelectionSerializer(subjectselection, data=data, partial=True)
        if serializer.is_valid(): 
            subjectselection = serializer.save() 
            message = "Subject Selection updated successfully."
            data = SubjectSelectionSerializer(subjectselection).data    
        
            return Response({
                "message": message,
                "data": data
            })
        
        return Response({
            "error": "Subject Selection not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        subjectselection = self.get_object()
        if subjectselection:
            subjectselection.delete()
            resp = {
                "message": "Subject Selection deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"error": "Subject Selection not found."}, status=status.HTTP_404_NOT_FOUND)
    