from django.urls import path

from .views import ListCreateStudentAttendance, RetrieveUpdateDestoryStudentAttendance

urlpatterns = [
<<<<<<< HEAD
    path('student-attendance', ListCreateStudentAttendance.as_view(), name='student_attendance_list_create'),
    path('student-attendance/<int:pk>/', RetrieveUpdateDestoryStudentAttendance.as_view(), name='student_attendance_retrieve_update_destroy'),
=======
    path('student-attendance', StudentAttendanceListCreateAPIView.as_view(), name='student-attendance-list-create'),
    path('student-attendance/<int:pk>/', StudentAttendanceRetrieveUpdateDestroyAPIView.as_view(), name='student-attendance-retrieve-update-destroy'),
>>>>>>> 6a8c99d (Student Attendance Testing)
]
