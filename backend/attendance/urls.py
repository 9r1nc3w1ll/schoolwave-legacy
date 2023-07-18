from django.urls import path

from .views import ListCreateStudentAttendance, RetrieveUpdateStudentAttendance, CreateMultipleStudentAttendance

urlpatterns = [
    path(
        "/student-attendance",
        ListCreateStudentAttendance.as_view(),
        name="student_attendance_list_create",
    ),
    path(
        "/student-attendance/create",
        CreateMultipleStudentAttendance.as_view(),
        name="create_multiple_student_attendance",
    ),
    path(
        "/student-attendance/<uuid:pk>/<str:startdate>/<str:enddate>",
        RetrieveUpdateStudentAttendance.as_view(),
        name="student_attendance_retrieve",
    ),
    path(
        "/student-attendance/<uuid:pk>",
        RetrieveUpdateStudentAttendance.as_view(),
        name="student_attendance_update_destroy",
    ),
]
