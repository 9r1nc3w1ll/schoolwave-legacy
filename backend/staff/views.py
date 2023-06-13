from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Staff
from .serializers import StaffSerializer
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
            student = serializer.save()
            message = "Staff created successfully."
            data = StaffSerializer(student)

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
            return Response({
                    'error': 'Staff not found.'
                    })
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
            message = "Staff updated successfully."
            data = StaffSerializer(staff).data    
        
            return Response({
                "message": message,
                "data": data
            })
        
        return Response({
            "error": "Staff not found.",
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
            return Response({"error": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)