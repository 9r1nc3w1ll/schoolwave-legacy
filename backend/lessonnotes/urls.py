from django.urls import path

from .views import ListCreateLessonNote, RetrieveUpdateDestoryLessonNote, UploadLessonNoteFile

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
    path("/upload-note-files", UploadLessonNoteFile.as_view(), name="upload_lesson_note"),
]
