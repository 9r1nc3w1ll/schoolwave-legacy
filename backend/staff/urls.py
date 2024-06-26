from django.urls import path

from .views import ListCreateStaff, RetrieveUpdateDestoryStaff, ListCreateStaffRole, \
    RetrieveUpdateDestoryStaffRole, AssignedSubjectsView, AssignedClassesView, BatchUploadStaff

urlpatterns = [
    path("/batch_upload", BatchUploadStaff.as_view(), name="batch_upload_staff"),
    path(
        "/staff-list",
        ListCreateStaff.as_view(),
        name="staff_list_create",
    ),
    path(
        "/staff-detail/<uuid:pk>",
        RetrieveUpdateDestoryStaff.as_view(),
        name="staff_retrieve_update_destroy",
    ),
    path(
        "/staff-role-list",
        ListCreateStaffRole.as_view(),
        name="staff_role_list_create",
    ),
    path(
        "/staff-role-detail/<str:name>",
        RetrieveUpdateDestoryStaffRole.as_view(),
        name="staff_role_retrieve_update_destroy",
    ),
    path('/teachers_assigned_subjects/<uuid:pk>',
        AssignedSubjectsView.as_view(),
        name='assigned_subjects'),
    path('/teachers_assigned_classes/<uuid:pk>',
        AssignedClassesView.as_view(),
        name='assigned_classes'),
]

