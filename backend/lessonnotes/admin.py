from django.contrib import admin
from .models import LessonNote, LessonNoteFile

# Register your models here.
admin.site.register(LessonNote)
admin.site.register(LessonNoteFile)
