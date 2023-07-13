from django.urls import path
from .views import GradingSchemeCreateView, GradeListCreateView, GradeRetrieveUpdateDestroyView, ResultListCreateView, ResultRetrieveUpdateDestroyView

urlpatterns = [
    path('/grading_schemes/', GradingSchemeCreateView.as_view(), name='grading-scheme-create'),
    path('/grades/', GradeListCreateView.as_view(), name='grade-list'),
    path('/grades/<uuid:pk>/', GradeRetrieveUpdateDestroyView.as_view(), name='grade-detail'),
    path('/results/', ResultListCreateView.as_view(), name='result-list'),
    path('/results/<uuid:pk>/', ResultRetrieveUpdateDestroyView.as_view(), name='result-detail'),
]
