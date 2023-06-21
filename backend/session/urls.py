from django.urls import path

from .views import ListCreateSession, RetrieveUpdateDestorySession, ListCreateTerm, RetrieveUpdateDestroyTerm

urlpatterns = [
    path("/session", ListCreateSession.as_view(), name="list_create_session"),
    path(
        "/session/<uuid:pk>",
        RetrieveUpdateDestorySession.as_view(),
        name="retrieve_update_destroy_session",
    ),
    path("/term", ListCreateTerm.as_view(), name="list_create_term"),
    path(
        "/term/<uuid:pk>",
        RetrieveUpdateDestroyTerm.as_view(),
        name="retrieve_update_destroy_term",
    ),
]
