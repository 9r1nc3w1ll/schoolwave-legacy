from django.urls import path

from admission.views import (
    BatchUploadAdmissionRequest,
    ListCreateAdmissionRequests,
    RUDAdmissionRequests,
)

urlpatterns = [
    path(
        "/batch_upload_requests",
        BatchUploadAdmissionRequest.as_view(),
        name="batch_upload_requests",
    ),
    path(
        "/requests", ListCreateAdmissionRequests.as_view(), name="list_create_requests"
    ),
    path(
        "/requests/<uuid:pk>",
        RUDAdmissionRequests.as_view(),
        name="retrieve_update_destroy_requests",
    ),
]
