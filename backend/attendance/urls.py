from django.urls import path

from .views import ListCreateStudentAttendance, RetrieveUpdateDestoryStudentAttendance, RetrieveStudentClassAttendance

urlpatterns = [
    path(
        "/student-attendance",
        ListCreateStudentAttendance.as_view(),
        name="student_attendance_list_create",
    ),
    path(
        "/student-attendance/<uuid:pk>",
        RetrieveUpdateDestoryStudentAttendance.as_view(),
        name="student_attendance_retrieve_update_destroy",
    ),
]
