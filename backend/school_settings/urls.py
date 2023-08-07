from django.urls import path

from school_settings.views import SchoolSettingsCreateView, FetchSettings, UploadLogo, GetLogo

urlpatterns = [
    path("", SchoolSettingsCreateView.as_view()),
    path("/<uuid:school_id>", FetchSettings.as_view()),
    path("/upload_school_logo", UploadLogo.as_view()),
    path("/get_school_logo", GetLogo.as_view()),
]