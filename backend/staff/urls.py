from django.urls import path

from .views import ListCreateStaff, RetrieveUpdateDestoryStaff

urlpatterns = [
    path(
        "/staff-list",
        ListCreateStaff.as_view(),
        name="staff_list_create",
    ),
    path(
        "/staff-detail/<int:pk>/",
        RetrieveUpdateDestoryStaff.as_view(),
        name="staff_retrieve_update_destroy",
    ),
]

