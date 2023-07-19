from django.urls import path
from .views import GradingSchemeCreateView, GradeListCreateView, GradeRetrieveUpdateDestroyView,\
      ResultRetrieveUpdateDestroyView, GetResultsByStudent, GetResultsBySubject, ComputeResults

urlpatterns = [
    path('/grading_schemes/', GradingSchemeCreateView.as_view(), name='grading-scheme-create'),
    path('/grades/', GradeListCreateView.as_view(), name='grade-list'),
    path('/grades/<uuid:pk>/', GradeRetrieveUpdateDestroyView.as_view(), name='grade-detail'),
    path("/compute_results/<uuid:term_id>", ComputeResults.as_view(), name="compute_results"),
    path('/results/<uuid:student_id>', GetResultsByStudent.as_view(), name='result-list'),
    path('/results/<uuid:suject_id>', GetResultsBySubject.as_view(), name='result-list'),
    path('/results/<uuid:pk>/', ResultRetrieveUpdateDestroyView.as_view(), name='result-detail'),
]
