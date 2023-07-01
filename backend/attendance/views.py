from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from school.models import School
from django.db.models import Q
import uuid

class ListCreateStudentAttendance(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def get_queryset(self):
        studentattendance_id = self.kwargs.get("studentattendance_id")
        if studentattendance_id:
            return self.queryset.filter(id=studentattendance_id)
        else:
            return self.queryset.all()

        

    def create(self, request, *args, **kwargs):
        serializer = AttendanceRecordSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            message = "Student attendance created successfully."
            data = AttendanceRecordSerializer(student)

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
            "message": "Student attendance fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RetrieveUpdateDestoryStudentAttendance(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def get_object(self):
        pk = self.kwargs.get("pk")
        try:
            if isinstance(pk, uuid.UUID):
                return AttendanceRecord.objects.filter(
                    Q(id=pk) | Q(student=pk) | Q(class_id=pk) | Q(subject=pk) | Q(staff=pk)
                )
            else:
                return Response({'message': 'Student attendance not found.'}, status=status.HTTP_404_NOT_FOUND)
        except AttendanceRecord.DoesNotExist:
            return Response({
                    'message': 'Student attendance not found.'}, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, *args, **kwargs):
        studentattendance = self.get_object()
        serializer = StudentAttendanceSerializer(studentattendance, many=True)
        resp = {
            "message": "Student attendance retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        studentattendance = self.get_object()

        serializer = AttendanceRecordSerializer(studentattendance, data=data, partial=True)
        if serializer.is_valid(): 
            studentattendance = serializer.save() 
            message = "Student attendance updated successfully."
            data = AttendanceRecordSerializer(studentattendance).data    
        
            return Response({
                "message": message,
                "data": data
            })
        
        return Response({
            "message": "Student attendance not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        studentattendance = self.get_object()
        if studentattendance:
            studentattendance.delete()
            resp = {
                "message": "Student attendance deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Student attendance not found."}, status=status.HTTP_404_NOT_FOUND)