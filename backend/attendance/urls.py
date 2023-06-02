from django.urls import path
from .views import StudentAttendanceListCreateAPIView, StudentAttendanceRetrieveUpdateDestroyAPIView

app_name = 'attendance'

urlpatterns = [
    path('student-attendance', StudentAttendanceListCreateAPIView.as_view(), name='student-attendance-list-create'),
    path('student-attendance/<int:pk>/', StudentAttendanceRetrieveUpdateDestroyAPIView.as_view(), name='student-attendance-retrieve-update-destroy'),
]
