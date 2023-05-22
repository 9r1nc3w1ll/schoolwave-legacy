from django.urls import path

from .views import ListCreateSession, RetrieveUpdateDestorySession

urlpatterns = [
    path("session", ListCreateSession.as_view(), name="list_create_session"),
    path(
        "session/<int:pk>",
        RetrieveUpdateDestorySession.as_view(),
        name="retrieve_update_destroy_session",
    ),
]
