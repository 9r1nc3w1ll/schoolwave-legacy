from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import StudentAttendance
from .serializers import StudentAttendanceSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class StudentAttendanceListCreateAPIView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = StudentAttendance.objects.all()
    serializer_class = StudentAttendanceSerializer

    def get_queryset(self):
        studentattendance_id = self.kwargs.get("studentattendance_id")
        if studentattendance_id:
            return self.queryset.filter(id=studentattendance_id)
        else:
            return self.queryset.all()

    def create(self, request, *args, **kwargs):
        serializer = StudentAttendanceSerializer(data=request.data)
        if serializer.is_valid():
            studentattendance = serializer.save()
            message = "Student attendance created successfully."
            data = StudentAttendanceSerializer(studentattendance).data

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

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        message = "Student attendance retrieved successfully."

        resp = {
            "message": message,
            "data": serializer.data,
        }
        return Response(resp)


class StudentAttendanceRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = StudentAttendance.objects.all()
    serializer_class = StudentAttendanceSerializer
    lookup_field = "studentattendance_id"

    def get_object(self):
        studentattendance_id = self.kwargs.get("studentattendance_id")
        try:
            studentattendance = self.queryset.get(id=studentattendance_id)
            return studentattendance
        except StudentAttendance.DoesNotExist:
            return None

    def get(self, request, *args, **kwargs):
        studentattendance = self.get_object()
        if studentattendance:
            serializer = self.get_serializer(studentattendance)
            resp = {
                "message": "Student attendance retrieved successfully.",
                "data": serializer.data,
            }
            return Response(resp)
        else:
            return Response({"error": "Student attendance not found."}, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, *args, **kwargs):
        studentattendance = self.get_object()
        if studentattendance:
            serializer = self.get_serializer(studentattendance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            studentattendance = serializer.save()
            resp = {
                "message": "Student attendance updated successfully.",
                "data": StudentAttendanceSerializer(studentattendance).data,
            }
            return Response(resp)
        else:
            return Response({"error": "Student attendance not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, *args, **kwargs):
        studentattendance = self.get_object()
        if studentattendance:
            studentattendance.delete()
            resp = {
                "message": "Student attendance deleted successfully.",
            }
            return Response(resp)
        else:
            return Response({"error": "Student attendance not found."}, status=status.HTTP_404_NOT_FOUND)
