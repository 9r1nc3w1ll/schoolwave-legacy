from django.urls import include, path

from school.views import (
    CreateOwner,
    CreateSchool,
    ListCreateClass,
    RetrieveUpdateDestoryClass,
    SetupStatus,
    ListCreateClassMember,
    RetrieveUpdateDestoryClassMember,
    ListStudentClass,
    DashboardStatsAPIView,
    CreateSchoolAndOwner
)

urlpatterns = [
    path("", CreateSchool.as_view(), name="create_school"),
    path("/setup-status", SetupStatus.as_view(), name="setup_status"),
    path("/register-admin", CreateOwner.as_view(), name="register_admin"),
    path("/class", ListCreateClass.as_view(), name="list_create_class"),
    path(
        "/class/<uuid:pk>",
        RetrieveUpdateDestoryClass.as_view(),
        name="retrieve_update_destroy_class",
    ),
    path("/class-member", ListCreateClassMember.as_view(), name="list_create_class_member"),
    path(
        "/class-member/<uuid:pk>",
        RetrieveUpdateDestoryClassMember.as_view(),
        name="retrieve_update_destroy_class_member",
    ),
    path("/student-class", ListStudentClass.as_view(), name="list_student_class"),
    path("/dashboard-stats/<uuid:school_id>", DashboardStatsAPIView.as_view(), name="dashboard_stats"),
    path('/create-school-and-owner', CreateSchoolAndOwner.as_view(), name='create_school_and_owner'),
]
