from django.urls import path

from .views import ListCreateClass, RetrieveUpdateDestoryClass

urlpatterns = [
    path("class", ListCreateClass.as_view(), name="list_create_class"),
    path(
        "class/<uuid:pk>",
        RetrieveUpdateDestoryClass.as_view(),
        name="retrieve_update_destroy_class",
    ),
]
