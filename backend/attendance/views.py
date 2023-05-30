from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import StudentAttendance
from .serializers import StudentAttendanceSerializer

class StudentAttendanceListCreateAPIView(ListCreateAPIView):
    queryset = StudentAttendance.objects.all()
    serializer_class = StudentAttendanceSerializer

class StudentAttendanceRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = StudentAttendance.objects.all()
    serializer_class = StudentAttendanceSerializer
