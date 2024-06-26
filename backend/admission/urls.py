from django.urls import path

from admission.views import (
    BatchUploadAdmissionRequest,
    BatchUpdateAdmissionRequests,
    ListCreateAdmissionRequests,
    RUDAdmissionRequests,
    CreateSingleAdmission,
    GetSampleCSV
)

urlpatterns = [
    path(
        "/batch_upload_requests",
        BatchUploadAdmissionRequest.as_view(),
        name="batch_upload_requests",
    ),
    path("/batch_update_requests", BatchUpdateAdmissionRequests.as_view(), name="batch_update_requests"),
    path("/requests/create", CreateSingleAdmission.as_view(), name="create_single_admission"),
    path(
        "/requests", ListCreateAdmissionRequests.as_view(), name="list_create_requests"
    ),
    path(
        "/requests/<uuid:pk>",
        RUDAdmissionRequests.as_view(),
        name="retrieve_update_destroy_requests",
    ),
    path("/get_sample_csv", GetSampleCSV.as_view()),
]
