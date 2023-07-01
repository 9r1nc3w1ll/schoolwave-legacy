from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Family, FamilyRole
from .serializers import ParentSerializer, ParentRoleSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

class ListCreateParent(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Family.objects.all()
    serializer_class = ParentSerializer

    def get_queryset(self):
        parent_id = self.kwargs.get("parent_id")
        if parent_id:
            return self.queryset.filter(id=parent_id)
        else:
            return self.queryset.all()

        

    def create(self, request, *args, **kwargs):
        serializer = ParentSerializer(data=request.data)
        if serializer.is_valid():
            parent = serializer.save()
            message = "Parent created successfully."
            data = ParentSerializer(parent)

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
            "message": "Parent fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)
    

class RetrieveUpdateDestoryParent(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Family.objects.all()
    serializer_class = ParentSerializer

    def get_object(self):
        parent_id = self.kwargs.get("pk")
        try:
            parent = Family.objects.get(id=parent_id)
        except Family.DoesNotExist:
            return Response({"message": "Parent not found."}, status=status.HTTP_404_NOT_FOUND)
        return parent

    def retrieve(self, request, *args, **kwargs):
        parent = self.get_object()
        serializer = ParentSerializer(parent)
        resp = {
            "message": "Parent retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        parent = self.get_object()

        serializer = ParentSerializer(parent, data=data, partial=True)
        if serializer.is_valid(): 
            parent = serializer.save() 
            data = ParentSerializer(parent).data    
        
            return Response({
                "message": "Parent updated successfully.",
                "data": data
            })
        
        return Response({
            "message": "Parent not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        parent = self.get_object()
        if parent:
            parent.delete()
            resp = {
                "message": "Parent deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parent not found."}, status=status.HTTP_404_NOT_FOUND)
        

class ListCreateParentRole(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FamilyRole.objects.all()
    serializer_class = ParentRoleSerializer

    def get_queryset(self):
        parent_role = self.kwargs.get("name")
        if parent_role:
            return self.queryset.filter(name=parent_role)
        else:
            return self.queryset.all()

        

    def create(self, request, *args, **kwargs):
        serializer = ParentRoleSerializer(data=request.data)
        if serializer.is_valid():
            parent_role = serializer.save()
            message = "Parent role created successfully."
            data = ParentRoleSerializer(parent_role)

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
            "message": "Parent role fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)
    

class RetrieveUpdateDestoryParentRole(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = FamilyRole.objects.all()
    serializer_class = ParentRoleSerializer

    def get_object(self):
        parent_role = self.kwargs.get("name")
        try:
            parent = FamilyRole.objects.get(name=parent_role)
        except FamilyRole.DoesNotExist:
            return Response({"message": "Parent role not found."}, status=status.HTTP_404_NOT_FOUND)
        return parent

    def retrieve(self, request, *args, **kwargs):
        parent_role = self.get_object()
        serializer = ParentRoleSerializer(parent_role)
        resp = {
            "message": "Parent role retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        parent_role = self.get_object()

        serializer = ParentRoleSerializer(parent_role, data=data, partial=True)
        if serializer.is_valid(): 
            parent_role = serializer.save() 
            data = ParentRoleSerializer(parent_role).data    
        
            return Response({
                "message": "Parent role updated successfully.",
                "data": data
            })
        
        return Response({
            "message": "Parent role not found.",
            "errors": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        parent_role = self.get_object()
        if parent_role:
            parent_role.delete()
            resp = {
                "message": "Parent role deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Parent not found."}, status=status.HTTP_404_NOT_FOUND)