from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Staff, StaffRole
from .serializers import StaffSerializer, StaffRoleSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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
        serializer = StaffSerializer(data=request.data)
        if serializer.is_valid():
            staff = serializer.save()
            message = "Staff created successfully."
            data = StaffSerializer(staff)

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
            message = "Staff role created successfully."
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