from django.urls import path
from .views import (
    GetSampleCSV,
    ListCreateSubject,
    RetrieveUpdateDestroySubject,
    ListCreateSubjectSelection,
    RetrieveUpdateDestroySubjectSelection,
    BatchUploadSubjects,
    ListCreateSubjectStaffAssignment,
    RetrieveUpdateDestroySubjectStaffAssignment,
)

urlpatterns = [
    path('/subjects', ListCreateSubject.as_view(), name='subject_list_create'),
    path('/subjects/<uuid:pk>', RetrieveUpdateDestroySubject.as_view(), name='subject_retrieve_update_destroy'),
    path('/subject-selections', ListCreateSubjectSelection.as_view(), name='subject_selection_list_create'),
    path('/subject-selections/<uuid:pk>', RetrieveUpdateDestroySubjectSelection.as_view(), name='subject_selection_retrieve_update_destroy'),
    path("/batch_upload_requests", BatchUploadSubjects.as_view(), name="batch_upload_subjects"),
    path('/subject-staff-assignment', ListCreateSubjectStaffAssignment.as_view(), name='subject_staff_assignment_list_create'),
    path('/subject-staff-assignment/<uuid:pk>', RetrieveUpdateDestroySubjectStaffAssignment.as_view(), name='subject_staff_assignment_retrieve_update_destroy'),
    path("/get_sample_csv", GetSampleCSV.as_view()),
]
