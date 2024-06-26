from django.urls import path

from .views import ListCreateParent, RetrieveUpdateDestoryParent, ListCreateParentRole,\
      RetrieveUpdateDestoryParentRole, BatchUploadFamily

urlpatterns = [
    path("/batch_upload", BatchUploadFamily.as_view(), name="batch_upload_parents"),
    path(
        "/parent-list",
        ListCreateParent.as_view(),
        name="parent_list_create",
    ),
    path(
        "/parent-detail/<uuid:pk>/",
        RetrieveUpdateDestoryParent.as_view(),
        name="parent_retrieve_update_destroy",
    ),
    path(
        "/parent-role-list",
        ListCreateParentRole.as_view(),
        name="parent_role_list_create",
    ),
    path(
        "/parent-role-detail/<str:name>/",
        RetrieveUpdateDestoryParentRole.as_view(),
        name="parent_role_retrieve_update_destroy",
    ),
]
