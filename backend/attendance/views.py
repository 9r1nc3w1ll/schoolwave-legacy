from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, GenericAPIView, CreateAPIView
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer, MultipleAttendanceRecordSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from school.models import School
from django.db.models import Q
import uuid
from datetime import datetime, timedelta

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
            "message": "Student attendance created successfully.",
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
            "message": "Student attendance fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class UpdateDestroyStudentAttendance(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        resp = {
            "message": "Attendance record updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "message": "Attendance record deleted successfully.",
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)

class RetrieveStudentAttendance(GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def get_object(self):
        pk = self.kwargs.get("pk")
        startdate = self.kwargs.get("startdate")
        enddate = self.kwargs.get("enddate")

        
        if startdate and enddate:
            start_datetime = datetime.strptime(startdate, "%Y-%m-%d")
            end_datetime = datetime.strptime(enddate, "%Y-%m-%d")

            return AttendanceRecord.objects.filter(
                Q(id=pk) | Q(student=pk) | Q(class_id=pk) | Q(subject=pk) | Q(staff=pk),
                date__range=[start_datetime, end_datetime]
            ).first()
        
        return super().get_object()

    def get(self, request, *args, **kwargs):
        studentattendance = self.get_object()
        serializer = AttendanceRecordSerializer(studentattendance, many=True)
        resp = {
            "message": "Student attendance retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)

class CreateMultipleStudentAttendance(CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AttendanceRecord.objects.all()
    serializer_class = MultipleAttendanceRecordSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        students = data.get("student", [])
        presents = data.get("present", [])
        remarks = data.get("remark", [])

        attendance_records = []
        for i in range(len(students)):
            attendance_data = {
                "class_id": data.get("class_id"),
                "staff": data.get("staff"),
                "attendance_type": data.get("attendance_type"),
                "student": students[i],
                "present": presents[i],
                "remark": remarks[i],
            }
            serializer = self.get_serializer(data=attendance_data)
            if not serializer.is_valid():
                resp = {
                    "message": "Validation error",
                    "errors": serializer.errors,
                }
                return Response(resp, status=status.HTTP_400_BAD_REQUEST)
            attendance_records.append(serializer.save())

        resp = {
            "message": "Attendance records created successfully",
            "attendance_records": MultipleAttendanceRecordSerializer(attendance_records, many=True).data,
        }
        return Response(resp, status=status.HTTP_201_CREATED)
