from django.urls import path

from school_settings.views import UpdateLogo, SchoolSettingsCreateView, FetchSettings, UploadSchoolLogo, GetLogo, ListCreateSchoolBrand, RetrieveUpdateDeleteSchoolBrand

urlpatterns = [
    path("", SchoolSettingsCreateView.as_view(), name="school_settings_create"),
    path("/<uuid:school_id>", FetchSettings.as_view(), name="fetch_school_settings"),
    path("/upload_school_logo", UploadSchoolLogo.as_view(), name="upload_school_logo"),
    path("/get_school_logo", GetLogo.as_view(), name="get_school_logo"),
    path("/update_logo", UpdateLogo.as_view(), name="update_school_logo"),
    path('/school-brand', ListCreateSchoolBrand.as_view(), name='school_brand'),
    path('/school-brand/<uuid:pk>', RetrieveUpdateDeleteSchoolBrand.as_view(), name='school_brand_detail'),
]