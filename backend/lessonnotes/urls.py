from django.urls import path

from .views import ListCreateLessonNote, RetrieveUpdateDestoryLessonNote

urlpatterns = [
    path(
        "/lesson-note-list",
        ListCreateLessonNote.as_view(),
        name="lesson_note_list_create",
    ),
    path(
        "/lesson-note-detail/<uuid:pk>",
        RetrieveUpdateDestoryLessonNote.as_view(),
        name="lesson_note_retrieve_update_destroy",
    ),
]
