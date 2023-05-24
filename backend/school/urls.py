from django.urls import include, path

from school.views import CreateOwner, CreateSchool, SetupStatus

urlpatterns = [
    path("setup-status", SetupStatus.as_view(), name="setup_status"),
    path("register-admin", CreateOwner.as_view(), name="register_admin"),
    path("create", CreateSchool.as_view(), name="create_school"),
]
