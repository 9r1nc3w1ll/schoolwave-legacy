from django.urls import path

from .views import ListCreateStudentAttendance, RetrieveUpdateDestoryStudentAttendance

urlpatterns = [
    path(
        "/student-attendance",
        ListCreateStudentAttendance.as_view(),
        name="student_attendance_list_create",
    ),
    path(
        "/student-attendance/<uuid:pk>/<str:startdate>/<str:enddate>",
        RetrieveUpdateDestoryStudentAttendance.as_view(),
        name="student_attendance_retrieve_update_destroy",
    ),
    path(
        "/student-attendance/<uuid:pk>",
        RetrieveUpdateDestoryStudentAttendance.as_view(),
        name="student_attendance_retrieve_update_destroy",
    ),
    path(
        "/student-class-attendance/<uuid:pk>",
        RetrieveUpdateDestoryStudentAttendance.as_view(),
        name="student_class_attendance_retrieve",
    ),
]
