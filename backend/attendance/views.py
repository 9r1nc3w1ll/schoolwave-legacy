from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, GenericAPIView, CreateAPIView
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer, MultipleAttendanceRecordSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from school.models import School, ClassMember
from account.models import User
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
        
        user = request.user
        role = user.role       
        
        if role == "admin":
            serializer.validated_data['staff_id'] = user.id
            serializer.validated_data['role'] = 'student'
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            resp = {
                "message": "Student attendance created successfully.",
                "data": serializer.data,
            }
            return Response(resp, status=status.HTTP_201_CREATED, headers=headers)
        
        elif role == "teacher":
            try:
                class_id = serializer.validated_data.get("class_id")
                user_class_member = ClassMember.objects.get(user=user, class_id=class_id)
                serializer.validated_data['staff_id'] = user.id
                serializer.validated_data['role'] = 'student'
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                resp = {
                    "message": "Student attendance created successfully.",
                    "data": serializer.data,
                }
                return Response(resp, status=status.HTTP_201_CREATED, headers=headers)
            except ClassMember.DoesNotExist:
                resp = {
                    "message": "You are not assigned to this class. Only assigned teachers can create student attendance for the class.",
                }
                return Response(resp, status=status.HTTP_403_FORBIDDEN)
            
        elif user:
            try:
                owner = School.objects.get(owner=user)
                serializer.validated_data['staff_id'] = owner.id
                serializer.validated_data['role'] = 'student'
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                resp = {
                    "message": "Student attendance created successfully.",
                    "data": serializer.data,
                }
                return Response(resp, status=status.HTTP_201_CREATED, headers=headers)
            except School.DoesNotExist:
                resp = {
                    "message": "Only admin or class teacher can create student attendance.",
                }
                return Response(resp, status=status.HTTP_403_FORBIDDEN)
                
        else:
            resp = {
                "message": "Only admin or class teacher can create student attendance.",
            }
            return Response(resp, status=status.HTTP_403_FORBIDDEN)


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        queryset = queryset.filter(role='student')

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

class RetrieveUpdateStudentAttendance(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def get_object(self):
        pk = self.kwargs.get("pk")
        startdate = self.kwargs.get("startdate")
        enddate = self.kwargs.get("enddate")

        try:
            if isinstance(pk, uuid.UUID):
                if startdate and enddate:
                    start_datetime = datetime.strptime(startdate, "%Y-%m-%d")
                    end_datetime = datetime.strptime(enddate, "%Y-%m-%d")

                    return AttendanceRecord.objects.filter(
                        Q(id=pk) | Q(attendee=pk) | Q(class_id=pk) | Q(subject=pk) | Q(staff=pk),
                        date__range=[start_datetime, end_datetime], role="student"
                    )
                else:
                    current_date = datetime.now().date()
                    return AttendanceRecord.objects.filter(
                       (Q(id=pk) | Q(attendee=pk) | Q(class_id=pk) | Q(staff=pk)) & Q(date=current_date), role="student"
                    )
            else:
                return Response({'message': 'Student attendance not found.'}, status=status.HTTP_404_NOT_FOUND)
        except AttendanceRecord.DoesNotExist:
            return Response({
                'message': 'Student attendance not found.'
            }, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, *args, **kwargs):
        studentattendance = self.get_object()
        serializer = AttendanceRecordSerializer(studentattendance, many=True)
        resp = {
            "message": "Student attendance retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def patch(self, request, *args, **kwargs):
        data = request.data
        pk = self.kwargs.get("pk")

        try:
            attendance_record = AttendanceRecord.objects.get(pk=pk)
        except AttendanceRecord.DoesNotExist:
            return Response({'message': 'Student attendance not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AttendanceRecordSerializer(attendance_record, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        studentattendance = serializer.save()

        return Response(
            {
                "message": "Student attendance updated successfully.",
                "data": AttendanceRecordSerializer(studentattendance).data,
            }
        )


class CreateMultipleStudentAttendance(CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AttendanceRecord.objects.all()
    serializer_class = MultipleAttendanceRecordSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        attendees = data.get("student", [])
        presents = data.get("present", [])
        remarks = data.get("remark", [])

        attendance_records = []
        for i in range(len(attendees)):
            attendance_data = {
                "class_id": data.get("class_id"),
                "staff": data.get("staff"),
                "attendance_type": data.get("attendance_type"),
                "attendee": attendees[i],
                "present": presents[i],
                "remark": remarks[i],
                "role": "student"
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
    

class ListCreateStaffAttendance(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def get_queryset(self):
        staffattendance_id = self.kwargs.get("staffattendance_id")
        if staffattendance_id:
            return self.queryset.filter(id=staffattendance_id)
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
        
        user = request.user
        role = user.role       
        
        if role == "admin":
            serializer.validated_data['staff_id'] = user.id
            serializer.validated_data['role'] = 'staff'
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            resp = {
                "message": "Staff attendance created successfully.",
                "data": serializer.data,
            }
            return Response(resp, status=status.HTTP_201_CREATED, headers=headers)
        
        elif role == "teacher":
            serializer.validated_data['staff_id'] = user.id
            serializer.validated_data['role'] = 'staff'
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            resp = {
                "message": "Staff attendance created successfully.",
                "data": serializer.data,
            }
            return Response(resp, status=status.HTTP_201_CREATED, headers=headers)    
        elif user:
            try:
                owner = School.objects.get(owner=user)
                serializer.validated_data['staff_id'] = owner.id
                serializer.validated_data['role'] = 'staff'
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                resp = {
                    "message": "Staff attendance created successfully.",
                    "data": serializer.data,
                }
                return Response(resp, status=status.HTTP_201_CREATED, headers=headers)
            except School.DoesNotExist:
                resp = {
                    "message": "Only admin or staff can create staff attendance.",
                }
                return Response(resp, status=status.HTTP_403_FORBIDDEN)
                
        else:
            resp = {
                "message": "Only admin or staff can create staff attendance.",
            }
            return Response(resp, status=status.HTTP_403_FORBIDDEN)


    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        queryset = queryset.filter(role='staff')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "message": "Staff attendance fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

class RetrieveStaffAttendance(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def get_object(self):
        pk = self.kwargs.get("pk")
        startdate = self.kwargs.get("startdate")
        enddate = self.kwargs.get("enddate")

        try:
            if isinstance(pk, uuid.UUID):
                if startdate and enddate:
                    start_datetime = datetime.strptime(startdate, "%Y-%m-%d")
                    end_datetime = datetime.strptime(enddate, "%Y-%m-%d")

                    return AttendanceRecord.objects.filter(
                        Q(id=pk) | Q(attendee=pk) | Q(class_id=pk) | Q(subject=pk) | Q(staff=pk),
                        date__range=[start_datetime, end_datetime], role="staff"
                    )
                else:
                    current_date = datetime.now().date()
                    return AttendanceRecord.objects.filter(
                       (Q(id=pk) | Q(attendee=pk) | Q(class_id=pk) | Q(staff=pk)) & Q(date=current_date), role="staff"
                    )
            else:
                return Response({'message': 'Staff attendance not found.'}, status=status.HTTP_404_NOT_FOUND)
        except AttendanceRecord.DoesNotExist:
            return Response({
                'message': 'Staff attendance not found.'
            }, status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, *args, **kwargs):
        staffattendance = self.get_object()
        serializer = AttendanceRecordSerializer(staffattendance, many=True)
        resp = {
            "message": "Staff attendance retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)

