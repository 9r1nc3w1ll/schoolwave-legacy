from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from school.models import School
from utils.permissions import IsSchoolOwner

from .models import Session, Term
from .serializers import SessionSerializer, TermSerializer

from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter, OpenApiResponse, OpenApiExample



class ListCreateSession(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        headers = self.get_success_headers(serializer.data)
        resp = {
            "status": "success",
            "message": "Session created successfully.",
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
            "status": "success",
            "message": "Sessions fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)


class RetrieveUpdateDestorySession(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Session.objects.all()
    serializer_class = SessionSerializer

    def get_queryset(self):
        """
        Modify in case user can have more than one school
        """
        school = School.objects.get(owner=self.request.user)

        qs = self.queryset.filter(school=school)
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        resp = {
            "status": "success",
            "message": "Session fetched successfully.",
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
            "status": "success",
            "message": "Session updated successfully.",
            "data": serializer.data,
        }
        return Response(resp)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        resp = {
            "status": "success",
            "message": "Session deleted successfully.",
        }

        return Response(resp, status=status.HTTP_204_NO_CONTENT)



@extend_schema_view(
    get=extend_schema(
        parameters=[
            OpenApiParameter(name='session_id', description='Filter by Session', type=str, required=False),
            OpenApiParameter(
                name="x-client-id",
                type=str,
                location=OpenApiParameter.HEADER,
                description="School ID",
            )
        ]
    )
)

class ListCreateTerm(ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsSchoolOwner]
    queryset = Term.objects.all()
    serializer_class = TermSerializer

    def get_queryset(self):        
        school = self.request.headers.get("x-client-id")

        qs = self.queryset.filter(school=school)
        return qs

    def create(self, request, *args, **kwargs):
        serializer = TermSerializer(data=request.data)
        if serializer.is_valid():
            term = serializer.save()
            message = "Term created successfully."
            data = TermSerializer(term)

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

        session_id = request.GET.get("session_id", "")

        if session_id:
            try:
                session = Session.objects.get(id=session_id)

                queryset = self.get_queryset().filter(session=session)
            except Session.DoesNotExist:
                return Response({"error" : f"Session with id {session_id} not found."}, status=status.HTTP_400_BAD_REQUEST)
            

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)

        resp = {
            "message": "Terms fetched successfully.",
            "data": serializer.data,
        }
        return Response(resp)

class RetrieveUpdateDestroyTerm(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Term.objects.all()
    serializer_class = TermSerializer

    def get_object(self):
        term_id = self.kwargs.get("pk")
        try:
            term = Term.objects.get(id=term_id)
        except Term.DoesNotExist:
            return Response({
                    'message': 'Term not found.'
                    })
        return term

    def retrieve(self, request, *args, **kwargs):
        term = self.get_object()
        serializer = TermSerializer(term)
        resp = {
            "message": "Term retrieved successfully.",
            "data": serializer.data,
        }
        return Response(resp)
        
    def patch(self, request, *args, **kwargs):
        data = request.data
        term = self.get_object()

        serializer = TermSerializer(term, data=data, partial=True)
        if serializer.is_valid(): 
            term = serializer.save() 
            message = "Term updated successfully."
            data = TermSerializer(term).data    
        
            return Response({
                "message": message,
                "data": data
            })
        
        return Response({
            "message": "Term not found.",
            "error": serializer.errors
            })

    def delete(self, request, *args, **kwargs):
        term = self.get_object()
        if term:
            term.delete()
            resp = {
                "message": "Term deleted successfully.",
            }
            return Response(resp, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"message": "Term not found."}, status=status.HTTP_404_NOT_FOUND)