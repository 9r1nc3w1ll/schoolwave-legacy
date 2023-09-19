from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Staff, StaffRole
from .serializers import StaffSerializer, StaffRoleSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from account.serializers import UserSerializer
from account.models import User
from rest_framework.views import APIView
from subject.serializers import SubjectSerializer
from school.serializers import ClassSerializer

from rest_framework.parsers import MultiPartParser
import csv
import io
from school.models import School

class BatchUploadStaff(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, *args, **kwargs):
        csv_file = request.FILES['csv']
        school_id = request.POST['school_id']

        if not csv_file.name.endswith('.csv'):
            return Response({'error': 'Invalid file format. Please upload a CSV file.'}, status=400)

        school = School.objects.get(id=school_id)

        data = csv_file.read().decode('utf-8')

        reader = csv.DictReader(io.StringIO(data))

        staff_list = []

        for row in reader:
            username = row["username"]
            first_name = row['first_name']
            last_name = row['last_name']
            email = row['email']
            title = row['title']
            role_names = row['roles'].split(',')

            user, _ = User.objects.get_or_create(username=username, first_name=first_name, last_name=last_name, email=email)

            roles = []
            for role_name in role_names:
                role, _ = StaffRole.objects.get_or_create(name=role_name.strip())
                roles.append(role)

            staff = Staff(user=user, title=title, school=school)
            staff.save()
            staff.roles.set(roles)
            staff_list.append(staff)

        serializer = StaffSerializer(staff_list, many=True)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

        
    
class ListCreateStaff(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

    def get_queryset(self):
        staff_id = self.kwargs.get("staff_id")
        if staff_id:
            return self.queryset.filter(id=staff_id)
        else:
            return self.queryset.all()

    def create(self, request, *args, **kwargs):
        school = request.data.get("school")
        school_settings = School.objects.get(id=school)

        prefix = school_settings.settings["staff_code_prefix"]
        total_students = Staff.objects.filter(
            school=school
        ).count()
        staff_number = f"{prefix}{total_students + 1:04d}"
        request.data["staff_number"] = staff_number

        data = request.data.copy()

        user_id = data.get("user_id")

        if user_id:
            try:
                user = User.objects.get(id=user_id)
                user.role = "staff"
                user.save()
                serializer = StaffSerializer(data=data)
                if serializer.is_valid():
                    staff = serializer.save(user=user)
                    message = "Staff created successfully."
                    data = StaffSerializer(staff).data
                    resp = {
                        "message": message,
                        "data": data,
                    }
                    return Response(resp, status=status.HTTP_201_CREATED)
                else:
                    resp = {
                        "message": "Invalid data.",
                        "errors": serializer.errors,
                    }
                    return Response(resp, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                resp = {
                    "message": "User with the provided ID does not exist.",
                }
                return Response(resp, status=status.HTTP_400_BAD_REQUEST)
        else:
            user_serializer = UserSerializer(data=data)
            if user_serializer.is_valid():
                staff_serializer = StaffSerializer(data=data)
                if user_serializer.is_valid() and staff_serializer.is_valid():
                    user = user_serializer.save(role="staff")
                    data["user"] = user.id
                    serializer = StaffSerializer(data=data)
                    if serializer.is_valid():
                        staff = serializer.save()
                        message = "Staff created successfully."
                        data = StaffSerializer(staff).data
                        resp = {
                            "message": message,
                            "data": data,
                        }
                        return Response(resp, status=status.HTTP_201_CREATED)
                    else:
                        resp = {
                            "message": "Validation Error.",
                            "errors": serializer.errors,
                        }
                        return Response(resp, status=status.HTTP_400_BAD_REQUEST)
                else:
                        resp = {
                            "message": "Validation Error.",
                            "errors": staff_serializer.errors,
                        }
                        return Response(resp, status=status.HTTP_400_BAD_REQUEST)
            else:
                resp = {
                    "message": "Validation Error.",
                    "errors": user_serializer.errors,
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
            "message": "Staff fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)
    

class RetrieveUpdateDestoryStaff(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer

    def get_object(self):
        staff_id = self.kwargs.get("pk")
        try:
            staff = Staff.objects.get(id=staff_id)
        except Staff.DoesNotExist:
            return Response({"message": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)
        return staff

    def retrieve(self, request, *args, **kwargs):
        staff = self.get_object()
        serializer = StaffSerializer(staff)
        resp = {
            "message": "Staff retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        staff = self.get_object()

        serializer = StaffSerializer(staff, data=data, partial=True)
        if serializer.is_valid(): 
            staff = serializer.save() 
            data = StaffSerializer(staff).data    
        
            return Response({
                "message": "Staff updated successfully.",
                "data": data
            })
        
        return Response({
            "message": "Staff not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        staff = self.get_object()
        if staff:
            staff.delete()
            resp = {
                "message": "Staff deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)
        

class ListCreateStaffRole(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = StaffRole.objects.all()
    serializer_class = StaffRoleSerializer

    def get_queryset(self):
        staff_role = self.kwargs.get("name")
        if staff_role:
            return self.queryset.filter(name=staff_role)
        else:
            return self.queryset.all()

        

    def create(self, request, *args, **kwargs):
        serializer = StaffRoleSerializer(data=request.data)
        if serializer.is_valid():
            staff_role = serializer.save()
            message = "Staff role assignment created successfully."
            data = StaffRoleSerializer(staff_role)

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
            "message": "Staff role fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)
    

class RetrieveUpdateDestoryStaffRole(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = StaffRole.objects.all()
    serializer_class = StaffRoleSerializer

    def get_object(self):
        staff_role = self.kwargs.get("name")
        try:
            staff = StaffRole.objects.get(name=staff_role)
        except StaffRole.DoesNotExist:
            return Response({"message": "Staff role not found."}, status=status.HTTP_404_NOT_FOUND)
        return staff

    def retrieve(self, request, *args, **kwargs):
        staff_role = self.get_object()
        serializer = StaffRoleSerializer(staff_role)
        resp = {
            "message": "Staff role retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        staff_role = self.get_object()

        serializer = StaffRoleSerializer(staff_role, data=data, partial=True)
        if serializer.is_valid(): 
            staff_role = serializer.save() 
            data = StaffRoleSerializer(staff_role).data    
        
            return Response({
                "message": "Staff role updated successfully.",
                "data": data
            })
        
        return Response({
            "message": "Staff role not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        staff_role = self.get_object()
        if staff_role:
            staff_role.delete()
            resp = {
                "message": "Staff role deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)
        
class AssignedSubjectsView(APIView):
    queryset = Staff.objects.all()
    serializer_class = SubjectSerializer

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get("pk")
        try:
            teacher = Staff.objects.get(id=pk)
            assigned_subjects = teacher.assigned_subjects.all()
            data = SubjectSerializer(assigned_subjects, many=True).data
        except Staff.DoesNotExist:
            data = None

        resp = {
            "message": "List of Subject assigned to a Teacher retrieved successfully.",
            "data": data,
        }
        return Response(resp)


class AssignedClassesView(APIView):
    queryset = Staff.objects.all()
    serializer_class = ClassSerializer

    def get(self, request, *args, **kwargs):
        pk = self.kwargs.get("pk")
        try:
            teacher = Staff.objects.get(id=pk)
            assigned_classes = teacher.assigned_classes.all()
            data = ClassSerializer(assigned_classes, many=True).data
        except Staff.DoesNotExist:
            data = None

        resp = {
            "message": "List of Class assigned to a Teacher retrieved successfully.",
            "data": data,
        }
        return Response(resp)