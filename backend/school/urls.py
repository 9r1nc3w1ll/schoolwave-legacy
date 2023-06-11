from django.urls import include, path

from school.views import (
    CreateOwner,
    CreateSchool,
    ListCreateClass,
    RetrieveUpdateDestoryClass,
    SetupStatus,
)

urlpatterns = [
    path("setup-status", SetupStatus.as_view(), name="setup_status"),
    path("register-admin", CreateOwner.as_view(), name="register_admin"),
    path("create", CreateSchool.as_view(), name="create_school"),
    path("class", ListCreateClass.as_view(), name="list_create_class"),
    path(
        "class/<uuid:pk>",
        RetrieveUpdateDestoryClass.as_view(),
        name="retrieve_update_destroy_class",
    ),
]
