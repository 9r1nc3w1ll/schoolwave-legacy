from django.urls import path

from admission.views import (
    BatchUploadAdmissionRequest,
    ListCreateAdmissionRequests,
    RUDAdmissionRequests,
    CreateSingleAdmission
)

urlpatterns = [
    path(
        "/batch_upload_requests",
        BatchUploadAdmissionRequest.as_view(),
        name="batch_upload_requests",
    ),
    path("/requests/create", CreateSingleAdmission.as_view(), name="create_single_admission"),
    path(
        "/requests", ListCreateAdmissionRequests.as_view(), name="list_create_requests"
    ),
    path(
        "/requests/<uuid:pk>",
        RUDAdmissionRequests.as_view(),
        name="retrieve_update_destroy_requests",
    ),
]
