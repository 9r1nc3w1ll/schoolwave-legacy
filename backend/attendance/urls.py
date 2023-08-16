from django.urls import path

from .views import (
    ListCreateStudentAttendance, 
    RetrieveUpdateStudentAttendance,
    CreateMultipleStudentAttendance,
    ListCreateStaffAttendance,
    RetrieveStaffAttendance
)

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
    path(
        "/staff-attendance",
        ListCreateStaffAttendance.as_view(),
        name="staff_attendance_list_create",
    ),
    path(
        "/staff-attendance/<uuid:pk>/<str:startdate>/<str:enddate>",
        RetrieveStaffAttendance.as_view(),
        name="staff_attendance_retrieve",
    ),
    path(
        "/staff-attendance/<uuid:pk>",
        RetrieveStaffAttendance.as_view(),
        name="staff_attendance_update_destroy",
    ),
    
]
