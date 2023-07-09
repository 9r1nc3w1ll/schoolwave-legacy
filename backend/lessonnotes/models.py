from django.db import models
from account.models import User
from school.models import Class
from config.models import BaseModel

class LessonNote(BaseModel):
    class Meta:
        db_table = "lesson_notes"

    week = models.JSONField()
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE)
    files = models.ManyToManyField('File', related_name='lesson_notes', blank=True)
    topic = models.CharField(max_length=150)
    description = models.TextField()
    tag = models.CharField(max_length=150, blank=True, null=True)
    content = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_lesson_notes')
    last_updated_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='updated_lesson_notes')

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)

class File(BaseModel):
    class Meta:
        db_table = "files"

    host = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_files')

    def save(self, *args, **kwargs):
        return super().save(*args, **kwargs)